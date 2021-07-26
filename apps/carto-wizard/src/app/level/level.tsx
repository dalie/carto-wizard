import { Map, MapboxGeoJSONFeature, MapLayerMouseEvent } from 'mapbox-gl';
import { Component } from 'react';
import { LevelType } from '../level-select/level-select.models';

import styles from './level.module.scss';
import appStyles from '../app.module.scss';
import homeStyles from '../home/home.module.scss';

import { LevelState } from './level.state';

/* eslint-disable-next-line */
export interface LevelProps {
  features: MapboxGeoJSONFeature[] | undefined;
  type: LevelType | undefined;
  map: Map | undefined;
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
    if (this._registeredListeners) {
      this.props?.map?.off('mousemove', 'countries_fill', this.onMouseMove);
      this.props?.map?.off('mouseleave', 'countries_fill', this.onMouseLeave);
      this.props?.map?.off('click', 'countries_fill', this.onMouseClick);
    }
  }

  render() {
    if (!this._registeredListeners && this.props.map) {
      this.props?.map?.on('mousemove', 'countries_fill', this.onMouseMove);
      this.props?.map?.on('mouseleave', 'countries_fill', this.onMouseLeave);
      this.props?.map?.on('click', 'countries_fill', this.onMouseClick);
      this._registeredListeners = true;
    }

    let start;
    if (this.state.showStart) {
      start = (
        <div className={appStyles.ui}>
          <button className={homeStyles.button} onClick={this.onStart}>
            Start
          </button>
        </div>
      );
    }

    let currentFeature;
    if (
      this.state.showCurrentFeature &&
      this.state.currentFeature?.properties
    ) {
      currentFeature = (
        <div className={styles.currentFeature}>
          <img
            src={`assets/flags/${this.state.currentFeature.properties.code}.png`}
            alt={this.state.currentFeature.properties.name}
          />
          {this.state.currentFeature.properties.name}
        </div>
      );
    }

    return (
      <>
        {start}
        {currentFeature}
      </>
    );
  }

  private onStart = () => {
    this.setState({
      currentFeature: this.state.features[0],
      showStart: false,
      showCurrentFeature: true,
    });
  };

  private onMouseClick = (e: MapLayerMouseEvent) => {
    if (
      this.props.map &&
      this.state.currentFeature &&
      e.features?.length &&
      e.features.length > 0
    ) {
      if (this.state.currentFeature.id === e.features[0].id) {
        this.setFeatureState([this.state.currentFeature.id], {
          guessed: true,
          correct: true,
        });

        this._hoveredStateIds = [];
      } else {
        this.setFeatureState([this.state.currentFeature.id], {
          guessed: true,
          wrong: true,
        });
      }

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
