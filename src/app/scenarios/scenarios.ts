import { UsStatesComponent } from './us-states/us-states.component';
import { WorldCountriesComponent } from './world-countries/world-countries.component';

export const scenarios: { id: string; name: string; component: any }[] = [
  {
    id: 'us-states',
    name: 'US States',
    component: UsStatesComponent,
  },
  {
    id: 'world-countries',
    name: 'World Countries',
    component: WorldCountriesComponent,
  },
];
