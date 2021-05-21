import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { FeatureGroup, geoJSON, Layer, LayerEvent } from 'leaflet';
import { BehaviorSubject, Subject } from 'rxjs';

interface State {
  id: string;
  name: string;
}

@Component({
  selector: 'app-us-states',
  templateUrl: './us-states.component.html',
  styleUrls: ['./us-states.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsStatesComponent implements OnInit {
  private _gameFinished$ = new BehaviorSubject<boolean>(false);
  private _gameStarted$ = new BehaviorSubject<boolean>(false);
  private _layers$ = new BehaviorSubject<Layer[]>([]);
  private _states: State[] = [];
  private _currentState$ = new BehaviorSubject<State>({
    id: '',
    name: '',
  });

  currentState$ = this._currentState$.asObservable();
  gameFinished$ = this._gameFinished$.asObservable();
  gameStarted$ = this._gameStarted$.asObservable();
  layers$ = this._layers$.asObservable();

  constructor(private readonly _http: HttpClient) {}

  ngOnInit(): void {
    this._http.get('./assets/geojson/us-states.json').subscribe({
      next: (data) => {
        this._states = (data as FeatureCollection).features
          .map((f) => {
            return {
              id: f.id as string,
              name: f.properties?.name,
            };
          })
          .map((a) => ({ sort: Math.random(), value: a }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value);

        this._layers$.next([
          geoJSON(data as any, {
            style: {
              color: '#1E90FF',
              weight: 2,
              opacity: 0.5,
              fillColor: '#1E90FF',
              fillOpacity: 0.15,
            },
            onEachFeature: this.onEachFeature,
          }),
        ]);
      },
    });
  }

  startGame() {
    this._currentState$.next(this._states[0]);
    this._gameStarted$.next(true);
  }

  private onStateClick = (event: LayerEvent) => {
    const stateId = event.target.feature.id;

    if (stateId === this._currentState$.value.id) {
      const layer: FeatureGroup = event.target;
      layer.setStyle({
        color: '#1EFF90',
        weight: 4,
        opacity: 0.5,
        fillColor: '#1EFF90',
        fillOpacity: 0.5,
      });
      this._states = this._states.filter((s) => s.id !== stateId);
      if (this._states.length) {
        this._currentState$.next(this._states[0]);
      } else {
        this._currentState$.next({
          id: '',
          name: 'Finished!',
        });
        this._gameFinished$.next(true);
      }
    }
  };

  private highlightFeature = (event: LayerEvent) => {
    const layer: FeatureGroup = event.target;
    layer.setStyle({
      color: '#1E90FF',
      weight: 4,
      opacity: 0.5,
      fillColor: '#1E90FF',
      fillOpacity: 0.5,
    });
  };

  private revertStyle = (event: LayerEvent) => {
    const layer: FeatureGroup = event.target;
    layer.setStyle({
      color: '#1E90FF',
      weight: 2,
      opacity: 0.5,
      fillColor: '#1E90FF',
      fillOpacity: 0.15,
    });
  };

  private onEachFeature = (f: GeoJSON.Feature, layer: Layer) => {
    layer.on({
      mouseup: this.onStateClick,
      mouseover: this.highlightFeature,
      mouseout: this.revertStyle,
    });
  };
}
