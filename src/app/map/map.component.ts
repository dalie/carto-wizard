import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { geoJSON, latLng, Layer, tileLayer } from 'leaflet';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private _layers$ = new BehaviorSubject<Layer[]>([]);

  layers$ = this._layers$.asObservable();

  options = {
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
    zoom: 5,
    center: latLng(46.879966, -121.726909),
  };
  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this._http.get('./assets/geojson/us-states.json').subscribe({
      next: (data) => {
        this._layers$.next([geoJSON(data as any)]);
      },
    });
  }
}
