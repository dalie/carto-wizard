import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { F1TracksComponent } from './scenarios/f1-tracks/f1-tracks.component';
import { ScenarioComponent } from './scenarios/scenario/scenario.component';

const routes: Routes = [
  {
    path: 'scenario/f1-tracks',
    component: F1TracksComponent,
  },
  {
    path: 'scenario/:scenarioId',
    component: ScenarioComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
