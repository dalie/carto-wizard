import { MapLayerMouseEvent } from 'mapbox-gl';
import { Component } from 'react';
import ReactMapboxGl, { Layer, Source } from 'react-mapbox-gl';

export class App extends Component {
  private _mapInstance: mapboxgl.Map | null = null;
  private _hoveredStateId: number | string | undefined = undefined;
  render() {
    const Map = ReactMapboxGl({
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
        <Source
          id="countries_source"
          promoteId="code"
          tileJsonSource={{
            type: 'vector',
            url: 'mapbox://dominicalie.69y4wl8p',
          }}
        ></Source>

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
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
        />
        <Layer
          type="line"
          id="countries_outline"
          sourceId="countries_source"
          sourceLayer="countries"
          paint={{
            'line-opacity': 1,
            'line-color': '#000000',
            'line-width': 1,
          }}
        />
      </Map>
    );
  }

  private onMouseMove = (e: MapLayerMouseEvent) => {
    if (this._mapInstance && e.features) {
      this._mapInstance.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (this._hoveredStateId !== undefined) {
          this.setFeatureState(this._hoveredStateId, { hover: false });
        }
        this._hoveredStateId = e.features[0].id;
        this.setFeatureState(this._hoveredStateId, { hover: true });
        console.log(e.features);
      }
    }
  };

  private onMouseLeave = (e: MapLayerMouseEvent) => {
    if (this._mapInstance) {
      this._mapInstance.getCanvas().style.cursor = '';
      if (this._hoveredStateId !== undefined) {
        this.setFeatureState(this._hoveredStateId, { hover: false });
      }
    }
  };

  private setFeatureState(id: number | string | undefined, properties: any) {
    this._mapInstance?.setFeatureState(
      {
        id,
        source: 'countries_source',
        sourceLayer: 'countries',
      },
      properties
    );
  }
}

export default App;
