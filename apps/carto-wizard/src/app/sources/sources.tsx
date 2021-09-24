import { Component } from 'react';
import { Source } from 'react-mapbox-gl';

/* eslint-disable-next-line */
export interface SourcesProps {}

export class Sources extends Component<SourcesProps> {
  render() {
    return (
      <>
        <Source
          key="countries"
          id="countries_source"
          tileJsonSource={{
            type: 'vector',
            url: 'mapbox://dominicalie.6qx7hy0c',
          }}
        ></Source>
        <Source
          key="regions"
          id="regions_source"
          geoJsonSource={{
            type: 'geojson',

            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-95, 55],
                  },
                  properties: {
                    label: 'North America',
                    name: 'Northern America',
                    wikiLink: 'North_America',
                  },
                },

                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-100, 20],
                  },
                  properties: {
                    isRegion: true,
                    label: 'Americas',
                    name: 'Americas',
                    wikiLink: 'Americas',
                  },
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-65, -20],
                  },
                  properties: {
                    label: 'South America',
                    name: 'South America',
                    wikiLink: 'South_America',
                  },
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-60, 20],
                  },
                  properties: {
                    label: 'Caribbean',
                    name: 'Caribbean',
                    wikiLink: 'Caribbean',
                  },
                },

                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [0, 50],
                  },
                  properties: {
                    isRegion: true,
                    label: 'Europe',
                    name: 'Europe',
                    wikiLink: 'Europe',
                  },
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [60, 60],
                  },
                  properties: {
                    label: 'Eastern Europe',
                    name: 'Eastern Europe',
                    wikiLink: 'Eastern_Europe',
                  },
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [20, 20],
                  },
                  properties: {
                    isRegion: true,
                    label: 'Africa',
                    name: 'Africa',
                    wikiLink: 'Africa',
                  },
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [50, 35],
                  },
                  properties: {
                    label: 'Middle East',
                    name: 'Middle East',
                    wikiLink: 'Middle_East',
                  },
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [100, 50],
                  },
                  properties: {
                    isRegion: true,
                    label: 'Asia',
                    name: 'Asia',
                    wikiLink: 'Asia',
                  },
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [70, -10],
                  },
                  properties: {
                    isRegion: true,
                    label: 'Indian Ocean',
                    name: 'Indian Ocean',
                    wikiLink: 'Indian_Ocean',
                  },
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [110, 10],
                  },
                  properties: {
                    label: 'Southeast Asia',
                    name: 'South-Eastern Asia',
                    wikiLink: 'Southeast_Asia',
                  },
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [145, -20],
                  },
                  properties: {
                    isRegion: true,
                    label: 'Oceania',
                    name: 'Oceania',
                    wikiLink: 'Oceania',
                  },
                },
              ],
            },
          }}
        ></Source>
      </>
    );
  }
}

export default Sources;
