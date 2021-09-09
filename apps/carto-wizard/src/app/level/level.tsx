import bbox from '@turf/bbox';
import {
  LngLatBounds,
  Map,
  MapboxGeoJSONFeature,
  MapLayerMouseEvent,
} from 'mapbox-gl';
import { Component } from 'react';
import { Marker } from 'react-mapbox-gl';
import appStyles from '../app.module.scss';
import CurrentChoices from '../current-choices/current-choices';
import CurrentFeature from '../current-feature/current-feature';
import LevelEnd from '../level-end/level-end';
import { LevelType } from '../level-select/level-select.models';
import LevelStart from '../level-start/level-start';
import styles from './level.module.scss';
import { LevelState } from './level.state';

/* eslint-disable-next-line */
export interface LevelProps {
  features?: MapboxGeoJSONFeature[];
  type?: LevelType;
  map?: Map;
}

export class Level extends Component<LevelProps, LevelState> {
  private _hoveredStateIds: (number | string | undefined)[] = [];
  private _registeredListeners = false;

  state: LevelState;

  constructor(props: LevelProps) {
    super(props);

    this.state = {
      features: props.features
        ? props.features
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
        : [],
      showStart: true,
    };
  }
  componentWillUnmount() {
    this.props?.map?.removeFeatureState({
      source: 'countries_source',
      sourceLayer: 'countries',
    });

    if (this._registeredListeners && this.props?.map) {
      this.props.map.off('mousemove', 'countries_fill', this.onMouseMove);
      this.props.map.off('mouseleave', 'countries_fill', this.onMouseLeave);
      this.props.map.off('click', 'countries_fill', this.onMouseClick);
      this.props.map.setFilter('countries_fill', null);
    }
  }

  render() {
    if (!this._registeredListeners && this.props.map) {
      if (
        this.props.type === LevelType.Locate ||
        this.props.type === LevelType.LocateFlag
      ) {
        this.props.map.on('mousemove', 'countries_fill', this.onMouseMove);
        this.props.map.on('mouseleave', 'countries_fill', this.onMouseLeave);
        this.props.map.on('click', 'countries_fill', this.onMouseClick);
        const codes = this.state.features.map((f) => f.properties?.code);
        this.props.map.setFilter('countries_fill', ['in', 'code', ...codes]);
      }

      const allBounds = new LngLatBounds();
      this.state.features.forEach((f) =>
        allBounds.extend(new LngLatBounds(bbox(f.geometry) as any))
      );

      this.props.map.fitBounds(allBounds, {
        padding: 100,
      });

      this._registeredListeners = true;
    }

    let start;
    if (this.state.showStart) {
      start = (
        <div className={appStyles.ui}>
          <LevelStart
            features={this.state.features}
            levelType={this.props.type ?? LevelType.Locate}
            onStart={this.onStart}
          ></LevelStart>
        </div>
      );
    }

    let end;
    if (this.state.showEnd) {
      end = (
        <div className={appStyles.ui}>
          <LevelEnd features={this.state.guessedFeatures}></LevelEnd>
        </div>
      );
    }

    let currentChoices;
    if (
      !this.isLocate() &&
      this.state.showCurrentChoices &&
      this.state.currentFeature?.properties &&
      this.state.currentChoices
    ) {
      currentChoices = (
        <CurrentChoices
          className={styles.currentFeature}
          choices={this.state.currentChoices}
          hideName={this.props.type === LevelType.IdentifyFlag}
          onSelectedChoice={this.onSelectedChoice}
        ></CurrentChoices>
      );
    }

    let currentFeature;
    if (
      this.isLocate() &&
      this.state.showCurrentFeature &&
      this.state.currentFeature?.properties
    ) {
      currentFeature = (
        <CurrentFeature
          className={styles.currentFeature}
          feature={this.state.currentFeature}
          hideName={this.props.type === LevelType.LocateFlag}
        ></CurrentFeature>
      );
    }

    return (
      <>
        {start}
        {end}
        {currentFeature}
        {currentChoices}
        {this.state.guessedFeatures?.map((f) => {
          let flagCode = f.feature.properties?.code;
          if (!flagCode) {
            flagCode = f.feature.properties?.parentCode;
          }

          const coords = f.feature.properties?.capital_location.split(',');

          return (
            <Marker key={f.feature.id} coordinates={[coords[1], coords[0]]}>
              <div className={styles.marker}>
                <img
                  alt={f.feature.properties?.name}
                  src={`assets/flags/${flagCode}.png`}
                />
              </div>
            </Marker>
          );
        })}
      </>
    );
  }

  private getChoices(answer: MapboxGeoJSONFeature): MapboxGeoJSONFeature[] {
    if (this.props.features) {
      return [
        answer,
        ...this.props.features
          .filter((f) => f.id !== answer.id)
          .map((a) => ({ sort: Math.random(), value: a }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value)
          .slice(0, 3),
      ]
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);
    } else {
      return [];
    }
  }

  private onSelectedChoice = (id: string) => {
    let correct = false;
    if (this.state.currentFeature?.id === id) {
      //correct
      correct = true;
      this.setFeatureState([this.state.currentFeature.id], {
        hover: false,
        guessed: true,
        correct: true,
      });
    } else {
      //wrong
      this.setFeatureState([this.state.currentFeature?.id], {
        hover: false,
        guessed: true,
        wrong: true,
      });
    }

    const guessed = this.state.guessedFeatures ?? [];
    guessed?.push({
      correct,
      feature: this.state.currentFeature as MapboxGeoJSONFeature,
    });

    this.setState({
      guessedFeatures: guessed,
    });

    const currentCode = this.state.currentFeature?.properties?.code;
    const features = this.state.features.filter(
      (f) => f.properties?.code !== currentCode
    );

    if (features.length > 0) {
      this.setState({
        features,
        currentFeature: features[0],
        currentChoices: this.getChoices(features[0]),
      });

      this.setFeatureState([features[0].id], {
        hover: true,
      });
    } else {
      //finished

      this.setState({
        showCurrentChoices: false,
        showStart: false,
        showEnd: true,
      });
    }
  };

  private isLocate() {
    return (
      this.props.type === LevelType.Locate ||
      this.props.type === LevelType.LocateFlag
    );
  }

  private onStart = () => {
    this.setState({
      currentFeature: this.state.features[0],
      showStart: false,
      showCurrentFeature: this.isLocate(),
      showCurrentChoices: !this.isLocate(),
    });

    if (!this.isLocate()) {
      this.setState({
        currentChoices: this.getChoices(this.state.features[0]),
      });
      this.setFeatureState([this.state.features[0].id], {
        hover: true,
      });
    }
  };

  private onMouseClick = (e: MapLayerMouseEvent) => {
    if (
      this.props.map &&
      this.state.currentFeature &&
      e.features?.length &&
      e.features.length > 0 &&
      !e.features[0].state.guessed
    ) {
      let correct = false;

      if (this.state.currentFeature.id === e.features[0].id) {
        this.setFeatureState([this.state.currentFeature.id], {
          hover: false,
          guessed: true,
          correct: true,
        });

        this._hoveredStateIds = [];
        correct = true;
      } else {
        this.setFeatureState([this.state.currentFeature.id], {
          hover: false,
          guessed: true,
          wrong: true,
        });
      }

      const guessed = this.state.guessedFeatures ?? [];
      guessed?.push({
        correct,
        feature: this.state.currentFeature,
      });

      this.setState({
        guessedFeatures: guessed,
      });

      const currentCode = this.state.currentFeature.properties?.code;
      const features = this.state.features.filter(
        (f) => f.properties?.code !== currentCode
      );

      if (features.length > 0) {
        this.setState({
          features,
          currentFeature: features[0],
        });
      } else {
        //finished

        this.setState({
          showCurrentFeature: false,
          showStart: false,
          showEnd: true,
        });
      }
    }
  };

  private onMouseMove = (e: MapLayerMouseEvent) => {
    if (this.props.map && e.features) {
      this.props.map.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (this._hoveredStateIds.length) {
          this.setFeatureState(this._hoveredStateIds, { hover: false });
        }
        if (!(e.features[0].state.correct || e.features[0].state.wrong)) {
          this._hoveredStateIds = [e.features[0].id];
          this.setFeatureState(this._hoveredStateIds, { hover: true });
        }
      }
    }
  };

  private onMouseLeave = (e: MapLayerMouseEvent) => {
    if (this.props.map) {
      this.props.map.getCanvas().style.cursor = '';
      if (this._hoveredStateIds.length) {
        this.setFeatureState(this._hoveredStateIds, { hover: false });
      }
      this._hoveredStateIds = [];
    }
  };

  private setFeatureState(
    ids: (number | string | undefined)[],
    properties: any
  ) {
    ids.forEach((id) => {
      this.props.map?.setFeatureState(
        {
          id,
          source: 'countries_source',
          sourceLayer: 'countries',
        },
        properties
      );
    });
  }
}

export default Level;
