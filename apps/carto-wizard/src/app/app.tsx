import React from 'react';
import ReactMapboxGl, { Layer, Source } from 'react-mapbox-gl';

export function App() {
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
    >
      <Source
        id="countries_source"
        tileJsonSource={{
          type: 'vector',
          url: 'mapbox://dominicalie.5pa5zemv',
        }}
      ></Source>
      <Layer type="raster" id="countries_layer" sourceId="countries_source" />
    </Map>
  );
}

export default App;
