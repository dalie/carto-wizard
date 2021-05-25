import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LuxonModule } from 'luxon-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PanelTitleComponent } from './panel-title/panel-title.component';
import { PanelComponent } from './panel/panel.component';
import { UsStatesComponent } from './scenarios/us-states/us-states.component';
import { WorldCountriesComponent } from './scenarios/world-countries/world-countries.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    PanelComponent,
    PanelTitleComponent,
    TimerComponent,
    UsStatesComponent,
    WorldCountriesComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    LeafletModule,
    LuxonModule,
    MatButtonModule,
    MatListModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
