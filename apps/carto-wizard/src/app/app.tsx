import { MapLayerMouseEvent } from 'mapbox-gl';
import { Component } from 'react';
import ReactMapboxGl, {
  Feature,
  Layer,
  Source,
  ZoomControl,
} from 'react-mapbox-gl';
import Sources from './sources/sources';

export class App extends Component {
  private _mapInstance: mapboxgl.Map | null = null;
  private _hoveredStateIds: (number | string | undefined)[] = [];
  render() {
    const Map = ReactMapboxGl({
      antialias: true,
      accessToken:
        'pk.eyJ1IjoiZG9taW5pY2FsaWUiLCJhIjoiY2tuZzJ0YWtvMDcwejJxczlwa2NtbW0zeSJ9.ire3NMM19l7z4Zeqa20RVw',
      dragRotate: false,
      minZoom: 2,
      maxZoom: 11,
      renderWorldCopies: true,
    });

    return (
      <Map
        center={[20, 20]}
        zoom={[2]}
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
        {/* <Layer
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
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
        />

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
          onMouseMove={this.onRegionMouseMove}
          onMouseLeave={this.onRegionMouseLeave}
        ></Layer> */}
      </Map>
    );
  }

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
