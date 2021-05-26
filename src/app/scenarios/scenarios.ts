import { UsStatesComponent } from './us-states/us-states.component';
import { WorldCountriesComponent } from './world-countries/world-countries.component';

export const scenarios: {
  id: string;
  data: string;
  name: string;
  component: any;
}[] = [
  {
    id: 'us-states',
    data: 'us-states.json',
    name: 'US States',
    component: UsStatesComponent,
  },
  {
    id: 'world-countries',
    data: 'world-countries.json',
    name: 'World Countries',
    component: WorldCountriesComponent,
  },
];
