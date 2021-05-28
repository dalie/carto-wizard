export interface Scenario {
  id: string;
  center: [number, number];
  data: string;
  name: string;
}

export const scenarios: Scenario[] = [
  {
    id: 'african-countries',
    center: [-2.6280076, 20.8168066],
    data: 'african-countries.json',
    name: 'African Countries',
  },
  {
    id: 'asian-countries',
    center: [26.3004167, 76.1711415],
    data: 'asian-countries.json',
    name: 'Asian Countries',
  },
  {
    id: 'us-states',
    center: [39.7108757, -101.05818],
    data: 'us-states.json',
    name: 'US States',
  },
  {
    id: 'european-countries',
    center: [47.7572071, 18.3125226],
    data: 'european-countries.json',
    name: 'European Countries',
  },
  {
    id: 'world-countries',
    center: [13.1263119, -40.5134056],
    data: 'world-countries.json',
    name: 'World Countries',
  },
];
