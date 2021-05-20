import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { latLng, MapOptions, tileLayer } from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { scenarios } from './scenarios/scenarios';
import { filter } from 'rxjs/internal/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  currentScenario = '';

  scenarioList = scenarios;

  options: MapOptions = {
    zoomControl: false,
    layers: [
      tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        }
      ),
    ],
    zoom: 4,
    center: latLng(39.7108757, -101.05818),
  };

  constructor(private readonly _router: Router) {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {});
  }

  ngOnInit(): void {}
}
