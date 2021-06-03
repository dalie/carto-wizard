import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { latLng, MapOptions, tileLayer } from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/internal/operators';
import { GameScenario } from './game.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly _scenarios$ = new BehaviorSubject<GameScenario[]>([]);

  readonly scenarios$ = this._scenarios$.asObservable();

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

  constructor(private readonly _http: HttpClient) {}

  ngOnInit(): void {
    this._http
      .get<GameScenario[]>('./assets/scenarios.json')
      .pipe(take(1))
      .subscribe({
        next: (scenarios) => {
          this._scenarios$.next(scenarios);
        },
      });
  }
}
