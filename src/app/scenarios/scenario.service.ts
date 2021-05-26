import { Injectable } from '@angular/core';
import { Map } from 'leaflet';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScenarioService {
  private _map$ = new BehaviorSubject<Map | null>(null);

  map$ = this._map$.asObservable();
  constructor() {}

  setMap(map: Map) {
    this._map$.next(map);
  }
}
