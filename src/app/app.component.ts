import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { latLng, Map, MapOptions, tileLayer } from 'leaflet';
import { filter } from 'rxjs/internal/operators';
import { ScenarioService } from './scenarios/scenario.service';
import { scenarios } from './scenarios/scenarios';

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
    worldCopyJump: true,
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

  constructor(
    private readonly _router: Router,
    private readonly _scenarioService: ScenarioService
  ) {
    this._router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        if (e.url.indexOf('/scenario/') === 0) {
          this.currentScenario = e.url.replace('/scenario/', '');
        }
      });
  }

  ngOnInit(): void {}

  onMapReady(map: Map) {
    this._scenarioService.setMap(map);
  }
}
