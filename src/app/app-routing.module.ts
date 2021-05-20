import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { scenarios } from './scenarios/scenarios';

const routes: Routes = scenarios.map((s) => {
  return {
    path: s.id,
    component: s.component,
  };
});
console.log(routes);
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
