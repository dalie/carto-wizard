import { MapboxGeoJSONFeature, MapLayerMouseEvent } from 'mapbox-gl';
import { Component } from 'react';
import ReactMapboxGl, { Layer, ZoomControl } from 'react-mapbox-gl';
import './app.module.scss';
import BackButton from './back-button/back-button';
import Home from './home/home';
import LevelSelect from './level-select/level-select';
import Sources from './sources/sources';

interface ComponentState {
  features?: MapboxGeoJSONFeature[];
  backState?: ComponentState;
  showBack?: boolean;
  showHome?: boolean;
  showLevelSelect?: boolean;
  showRegions?: boolean;
}

export class App extends Component<unknown, ComponentState | undefined> {
  private _mapInstance: mapboxgl.Map | null = null;
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

  state: ComponentState;

  constructor(props = {}) {
    super(props);
    this.state = {
      showHome: true,
    };
  }
  render() {
    let levelSelect;
    let regions;

    if (this.state.showLevelSelect) {
      levelSelect = <LevelSelect features={this.state.features}></LevelSelect>;
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
            sourceLayer="countries"
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
            sourceLayer="countries"
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
          {levelSelect}
          {regions}
        </this._mapComponent>
      </>
    );
  }

  private onClickBack = () => {
    console.log('back');
    this.setState(this.state.backState);
  };

  private onHomeSelectRegion = () => {
    this.setState({
      showHome: false,
      showRegions: true,
      showBack: true,
      backState: {
        showHome: true,
        showRegions: false,
        showBack: false,
        backState: null,
      },
    });
    console.log('Select Region');
  };

  private onHomeSelectWorld = () => {
    this.setState({
      showHome: false,
      showRegions: false,
      showBack: true,
      showLevelSelect: true,
      backState: {
        showHome: true,
        showRegions: false,
        showBack: false,
        showLevelSelect: false,
        backState: null,
      },
    });
    console.log('Select World');
  };

  private onMouseMove = (e: MapLayerMouseEvent) => {
    if (this._mapInstance && e.features) {
      this._mapInstance.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (this._hoveredStateIds.length) {
          this.setFeatureState(this._hoveredStateIds, { hover: false });
        }
        this._hoveredStateIds = [e.features[0].id];
        this.setFeatureState(this._hoveredStateIds, { hover: true });
      }
    }
  };

  private onMouseLeave = (e: MapLayerMouseEvent) => {
    if (this._mapInstance) {
      this._mapInstance.getCanvas().style.cursor = '';
      if (this._hoveredStateIds.length) {
        this.setFeatureState(this._hoveredStateIds, { hover: false });
      }
      this._hoveredStateIds = [];
    }
  };

  private onRegionMouseMove = (e: MapLayerMouseEvent) => {
    if (this._mapInstance && e.features) {
      this._mapInstance.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (this._hoveredStateIds.length) {
          this.setFeatureState(this._hoveredStateIds, { hover: false });
        }

        const region: string = e.features[0].properties?.name;

        this._hoveredStateIds = this._mapInstance
          .queryRenderedFeatures(undefined, {
            layers: ['countries_fill'],
          })
          .filter(
            (f) =>
              (f.properties?.area as string)
                .toLowerCase()
                .indexOf(region.toLowerCase()) >= 0
          )
          .map((f) => f.id);

        this.setFeatureState(this._hoveredStateIds, { hover: true });
      }
    }
  };

  private onRegionMouseLeave = (e: MapLayerMouseEvent) => {
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
        const region: string = e.features[0].properties?.name;

        const features = this._mapInstance
          .queryRenderedFeatures(undefined, {
            layers: ['countries_fill'],
          })
          .filter(
            (f) =>
              (f.properties?.area as string)
                .toLowerCase()
                .indexOf(region.toLowerCase()) >= 0
          );

        this.setState({
          features,
          showLevelSelect: true,
          showRegions: false,
          backState: {
            features: [],
            showBack: true,
            showLevelSelect: false,
            showRegions: true,
          },
        });

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
          sourceLayer: 'countries',
        },
        properties
      );
    });
  }
}

export default App;
