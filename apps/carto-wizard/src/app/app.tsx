import { MapLayerMouseEvent } from 'mapbox-gl';
import { Component } from 'react';
import ReactMapboxGl, { Layer, ZoomControl } from 'react-mapbox-gl';
import './app.module.scss';
import { AppState, PropertiesJson, states } from './app.state';
import BackButton from './back-button/back-button';
import Home from './home/home';
import LevelSelect from './level-select/level-select';
import { LevelType } from './level-select/level-select.models';
import { Level } from './level/level';
import Sources from './sources/sources';

import axios from 'axios';

export interface JsonCountry {
  iso2: string;
  iso3: string;
  parentIso2?: string;
  noFlag?: boolean;
  name: string;
  nativeName: string;
  latlng: [number, number];
  capital: string;
  population: number;
  area: number;
  region: string;
  subregion?: string;
}
export class App extends Component<unknown, AppState | undefined> {
  private _hoveredRegion = '';

  private _mapInstance: mapboxgl.Map | undefined = undefined;
  private _hoveredStateIds: (number | string | undefined)[] = [];
  private _mapComponent = ReactMapboxGl({
    antialias: true,
    accessToken:
      'pk.eyJ1IjoiZG9taW5pY2FsaWUiLCJhIjoiY2tuZzJ0YWtvMDcwejJxczlwa2NtbW0zeSJ9.ire3NMM19l7z4Zeqa20RVw',
    dragRotate: false,
    minZoom: 2,
    maxZoom: 11,
    renderWorldCopies: true,
  });

  state: AppState;

  constructor(props = {}) {
    super(props);
    this.state = states['home'];
  }

  render() {
    let level;
    let levelSelect;
    let regions;

    if (this.state.showLevel) {
      level = (
        <Level
          features={this.state.features ?? []}
          map={this._mapInstance}
          type={this.state.levelType}
        ></Level>
      );
    }
    if (this.state.showLevelSelect) {
      levelSelect = (
        <LevelSelect
          features={this.state.features}
          region={this.state.selectedRegion}
          onLevelSelect={this.onLevelSelect}
        ></LevelSelect>
      );
    }
    if (this.state.showRegions) {
      regions = (
        <Layer
          id="regions"
          sourceId="regions_source"
          type="symbol"
          layout={{
            'text-font': ['Roboto Black Italic'],
            'text-field': ['get', 'name'],
            'text-anchor': 'top',
            'text-size': 48,
          }}
          paint={{
            'text-color': '#ffffff',
            'text-halo-blur': 2,
            'text-halo-color': '#222222',
            'text-halo-width': 3,
          }}
          onClick={this.onRegionMouseClick}
          onMouseMove={this.onRegionMouseMove}
          onMouseLeave={this.onRegionMouseLeave}
        ></Layer>
      );
    }
    return (
      <>
        {this.state.showBack && (
          <BackButton onClickBack={this.onClickBack}></BackButton>
        )}
        {this.state.showHome && (
          <Home
            onSelectRegion={this.onHomeSelectRegion}
            onSelectWorld={this.onHomeSelectWorld}
          ></Home>
        )}
        <this._mapComponent
          center={[20, 20]}
          zoom={[2]}
          // eslint-disable-next-line react/style-prop-object
          style="mapbox://styles/dominicalie/cktkdp5ye4yre17pb7tiy8yvs"
          containerStyle={{
            height: '100vh',
            width: '100vw',
          }}
          onSourceData={(map) => {
            this._mapInstance = map;
          }}
        >
          <ZoomControl />
          <Sources />
          <Layer
            type="line"
            id="countries_outline"
            sourceId="countries_source"
            sourceLayer="processed"
            paint={{
              'line-opacity': 1,
              'line-color': '#2a3d45',
              'line-width': 1,
            }}
          />
          <Layer
            type="fill"
            id="countries_fill"
            sourceId="countries_source"
            sourceLayer="processed"
            paint={{
              'fill-color': '#000000',
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.75,
                0,
              ],
            }}
          />
          <Layer
            type="fill"
            id="countries_fill_guess"
            sourceId="countries_source"
            sourceLayer="processed"
            paint={{
              'fill-color': [
                'case',
                ['boolean', ['feature-state', 'correct'], false],
                '#6eeb83',
                '#f05365',
              ],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'guessed'], false],
                0.5,
                0,
              ],
            }}
          />
          <Layer
            type="fill"
            id="countries_fill_disabled"
            sourceId="countries_source"
            sourceLayer="processed"
            paint={{
              'fill-color': '#ffffff',
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'disabled'], false],
                0.75,
                0,
              ],
            }}
          />
          {level}
          {levelSelect}
          {regions}
        </this._mapComponent>
      </>
    );
  }

  private onClickBack = () => {
    if (this.state.backState) {
      this.setState(states[this.state.backState]);
    }
  };

  private onHomeSelectRegion = () => {
    this.setState(states['regions']);
  };

  private onHomeSelectWorld = () => {
    const features = this._mapInstance?.queryRenderedFeatures(undefined, {
      layers: ['countries_fill'],
    });

    const req = new XMLHttpRequest();
    req.overrideMimeType('application/json');
    req.open('GET', 'https://en.wikipedia.org/api/rest_v1/page/summary/Earth');
    req.onload = () => {
      this.setState({
        wiki: JSON.parse(req.responseText),
      });
    };
    req.send();

    this.setState({
      features,
      backState: 'home',
    });

    this.setState(states['levelSelect']);
  };

  private onLevelSelect = (type: LevelType) => {
    this.setState({
      levelType: type,
    });

    this.setState(states['level']);
    if (type === LevelType.IdentifyFlag || type === LevelType.LocateFlag) {
      this.setState({
        features: this.state.features?.filter(
          (f) => !(f.properties as PropertiesJson).noFlag
        ),
      });
    }
  };

  private onRegionMouseMove = (e: MapLayerMouseEvent) => {
    if (this._mapInstance && e.features) {
      this._mapInstance.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0 && e.features[0].id !== this._hoveredRegion) {
        this._hoveredRegion = e.features[0].id as string;

        if (this._hoveredStateIds.length) {
          this.setFeatureState(this._hoveredStateIds, { hover: false });
        }
        const { isRegion, name } = e.features[0].properties as any;

        if (name) {
          this._hoveredStateIds = this._mapInstance
            ?.queryRenderedFeatures(undefined, {
              layers: ['countries_fill'],
              filter: ['==', isRegion ? 'region' : 'subregion', name],
            })
            .map((f) => f.id);

          this.setFeatureState(this._hoveredStateIds, { hover: true });
        }
      }
    }
  };

  private onRegionMouseLeave = (e: MapLayerMouseEvent) => {
    this._hoveredRegion = '';
    if (this._mapInstance) {
      this._mapInstance.getCanvas().style.cursor = '';
      if (this._hoveredStateIds.length) {
        this.setFeatureState(this._hoveredStateIds, { hover: false });
      }

      this._hoveredStateIds = [];
    }
  };

  private onRegionMouseClick = (e: MapLayerMouseEvent) => {
    if (this._mapInstance && e.features) {
      if (e.features.length > 0) {
        const { isRegion, name } = e.features[0].properties as any;

        const features = this._mapInstance
          .querySourceFeatures('countries_source', {
            sourceLayer: 'processed',
            filter: [
              'all',
              ['has', 'area'],
              ['==', isRegion ? 'region' : 'subregion', name],
            ],
          })
          .filter(
            (feature, index, self) =>
              index === self.findIndex((f) => f.id === feature.id)
          );

        this.setState({
          features,
          backState: 'regions',
          selectedRegion: name,
        });

        this.setState(states['levelSelect']);

        this.onRegionMouseLeave(e);
      }
    }
  };

  private setFeatureState(
    ids: (number | string | undefined)[],
    properties: any
  ) {
    ids.forEach((id) => {
      this._mapInstance?.setFeatureState(
        {
          id,
          source: 'countries_source',
          sourceLayer: 'processed',
        },
        properties
      );
    });
  }
}

export default App;
