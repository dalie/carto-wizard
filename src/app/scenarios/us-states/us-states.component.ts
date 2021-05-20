import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FeatureGroup, geoJSON, Layer, LayerEvent } from 'leaflet';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-us-states',
  templateUrl: './us-states.component.html',
  styleUrls: ['./us-states.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsStatesComponent implements OnInit {
  private _layers$ = new BehaviorSubject<Layer[]>([]);

  layers$ = this._layers$.asObservable();
  constructor(private readonly _http: HttpClient) {}

  ngOnInit(): void {
    this._http.get('./assets/geojson/us-states.json').subscribe({
      next: (data) => {
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
    layer.on({ mouseover: this.highlightFeature, mouseout: this.revertStyle });
  };
}
