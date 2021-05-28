export interface Scenario {
  id: string;
  center: [number, number];
  data: string;
  name: string;
  zoom: number;
}

export const scenarios: Scenario[] = [
  {
    id: 'african-countries',
    center: [5, 20],
    data: 'african-countries.json',
    name: 'African Countries',
    zoom: 4,
  },
  {
    id: 'asian-countries',
    center: [27, 100],
    data: 'asian-countries.json',
    name: 'Asian Countries',
    zoom: 3.5,
  },
  {
    id: 'canadian-provinces',
    center: [60, -100],
    data: 'canadian-provinces.json',
    name: 'Canadian Provinces',
    zoom: 4,
  },
  {
    id: 'north-america-countries',
    center: [45, -100],
    data: 'north-america-countries.json',
    name: 'North American Countries',
    zoom: 3.5,
  },
  {
    id: 'philippines-regions',
    center: [11, 125],
    data: 'philippines-regions.json',
    name: 'Philippines Regions',
    zoom: 6,
  },

  {
    id: 'south-america-countries',
    center: [-22, -70],
    data: 'south-america-countries.json',
    name: 'South American Countries',
    zoom: 4,
  },
  {
    id: 'us-states',
    center: [40, -100],
    data: 'us-states.json',
    name: 'US States',
    zoom: 5,
  },
  {
    id: 'european-countries',
    center: [55, 20],
    data: 'european-countries.json',
    name: 'European Countries',
    zoom: 4,
  },
  {
    id: 'world-countries',
    center: [20, 20],
    data: 'world-countries.json',
    name: 'World Countries',
    zoom: 3,
  },
];
