import { MapLayerMouseEvent } from 'mapbox-gl';
import { Component } from 'react';
import ReactMapboxGl, { Layer, ZoomControl } from 'react-mapbox-gl';
import './app.module.scss';
import { AppState, states } from './app.state';
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
  private _jsonCountries: JsonCountry[] = [];

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

  componentDidMount() {
    axios.get('assets/geojson/countries.json').then((response) => {
      this._jsonCountries = response.data;
    });
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
          style="mapbox://styles/dominicalie/ckqzmhgmw3h9717uo5z4zvuiz"
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
            sourceLayer="country_boundaries"
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
            sourceLayer="country_boundaries"
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
            sourceLayer="country_boundaries"
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
            sourceLayer="country_boundaries"
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
    const countries = this._jsonCountries
      .filter((c) => !!c.region)
      .map((c) => c.iso2);
    const features = this._mapInstance?.queryRenderedFeatures(undefined, {
      layers: ['countries_fill'],
      filter: ['in', 'iso_3166_1', ...countries],
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
      const uniqueFlagCodes = this._jsonCountries
        .filter((c) => !c.parentIso2)
        .map((c) => c.iso2);

      this.setState({
        features: this.state.features?.filter((f) =>
          uniqueFlagCodes.indexOf(f.properties?.iso_3166_1)
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
        const regionFeature = e.features[0];
        if (regionFeature) {
          const region: string = regionFeature.properties?.name;

          const countries = this._jsonCountries
            .filter((c) =>
              regionFeature.properties?.isRegion
                ? c.region === region
                : c.subregion === region
            )
            .map((c) => c.iso2);
          this._hoveredStateIds = this._mapInstance
            ?.queryRenderedFeatures(undefined, {
              layers: ['countries_fill'],
              filter: ['in', 'iso_3166_1', ...countries],
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
        const regionFeature = e.features[0];
        const countries = this._jsonCountries
          .filter((c) =>
            regionFeature.properties?.isRegion
              ? c.region === regionFeature.properties?.name
              : c.subregion === regionFeature.properties?.name
          )
          .map((c) => c.iso2);

        const features = this._mapInstance
          .querySourceFeatures('countries_source', {
            sourceLayer: 'country_boundaries',
            filter: ['in', 'iso_3166_1', ...countries],
          })
          .filter(
            (feature, index, self) =>
              index === self.findIndex((f) => f.id === feature.id)
          );

        this.setState({
          features,
          backState: 'regions',
          selectedRegion: regionFeature.properties?.name,
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
          sourceLayer: 'country_boundaries',
        },
        properties
      );
    });
  }
}

export default App;
