import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FeatureCollection } from 'geojson';
import * as L from 'leaflet';
import { FeatureGroup, geoJSON, Layer, LayerEvent } from 'leaflet';
import { Duration } from 'luxon';
import { BehaviorSubject } from 'rxjs';
import { TimerService } from 'src/app/timer/timer.service';
import { ScenarioService } from '../scenario.service';

interface Country {
  id: string;
  name: string;
}

enum GameStatus {
  LOBBY = 1,
  STARTED = 2,
  FINISHED = 3,
}

enum GameDifficulty {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}

@Component({
  selector: 'app-world-countries',
  templateUrl: './world-countries.component.html',
  styleUrls: ['./world-countries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorldCountriesComponent implements OnInit {
  private _mouseDown = false;
  private _featres: FeatureGroup[] = [];
  private _score = 0;
  private _score$ = new BehaviorSubject<number>(-1);
  private _time$ = new BehaviorSubject<Duration>(Duration.fromMillis(0));
  private _gameStatus$ = new BehaviorSubject<GameStatus>(GameStatus.LOBBY);
  private _layers$ = new BehaviorSubject<Layer[]>([]);

  private _countries: Country[] = [];
  private _currentCountry$ = new BehaviorSubject<Country>({
    id: '',
    name: '',
  });

  private _styleNeutral = {
    color: '#1E90FF',
    weight: 2,
    opacity: 0.5,
    fillColor: '#1E90FF',
    fillOpacity: 0.15,
  };

  private _styleNeutralHighlight = {
    color: '#1E90FF',
    weight: 4,
    opacity: 0.5,
    fillColor: '#1E90FF',
    fillOpacity: 0.5,
  };

  private _styleCorrect = {
    color: '#1EFF90',
    weight: 4,
    opacity: 0.5,
    fillColor: '#1EFF90',
    fillOpacity: 0.5,
  };

  private _styleWrong = {
    color: '#FF1010',
    weight: 4,
    opacity: 0.5,
    fillColor: '#FF1010',
    fillOpacity: 0.5,
  };

  private _styleTransparent = {
    weight: 0,
    oppacity: 0,
    fillOpacity: 0,
  };

  GameDifficulty = GameDifficulty;
  GameStatus = GameStatus;

  score$ = this._score$.asObservable();
  currentCountry$ = this._currentCountry$.asObservable();

  gameStatus$ = this._gameStatus$.asObservable();
  layers$ = this._layers$.asObservable();
  time$ = this._time$.asObservable();

  gameDifficultyControl = new FormControl(GameDifficulty.EASY);

  get gameDifficulty(): GameDifficulty {
    return this.gameDifficultyControl.value;
  }

  constructor(
    private readonly _http: HttpClient,
    private readonly _timer: TimerService,
    private readonly _scenarioService: ScenarioService
  ) {}

  ngOnInit(): void {}

  startGame() {
    this._http.get('./assets/geojson/world-countries.json').subscribe({
      next: (data) => {
        this._countries = (data as FeatureCollection).features
          .map((f) => {
            return {
              id: f.properties?.iso_a3 as string,
              name: f.properties?.name,
            };
          })
          .map((a) => ({ sort: Math.random(), value: a }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value);

        this._layers$.next([
          geoJSON(data as any, {
            style:
              this.gameDifficulty !== GameDifficulty.HARD
                ? this._styleNeutral
                : this._styleTransparent,
            onEachFeature: this.onEachFeature,
          }),
        ]);
        this._score = 0;
        this._currentCountry$.next(this._countries[0]);
        this._gameStatus$.next(GameStatus.STARTED);
        this._scenarioService.map$.subscribe({
          next: (m) => {
            m?.on('move', () => {
              this._mouseDown = false;
            });
          },
        });
      },
    });
  }

  private onCountryClick = (event: LayerEvent) => {
    if (this._mouseDown) {
      this._mouseDown = false;
      const countryId = event.target.feature.properties.iso_a3;
      if (
        this.gameDifficulty !== GameDifficulty.EASY ||
        this._countries.find((s) => s.id === countryId)
      ) {
        let layer: FeatureGroup = event.target;
        if (countryId === this._currentCountry$.value.id) {
          layer.setStyle(this._styleCorrect);
          this._countries = this._countries.filter((s) => s.id !== countryId);
          this._score += 100 * this.gameDifficulty;
          if (this._countries.length) {
            this._currentCountry$.next(this._countries[0]);
          } else {
            this.endGame();
          }
        } else {
          layer = this._featres.find(
            (f) =>
              (<any>f).feature.properties.iso_a3 ===
              this._currentCountry$.value.id
          ) as any;

          layer.setStyle(this._styleWrong);
          this._countries = this._countries.filter(
            (s) => s.id !== this._currentCountry$.value.id
          );
          this._scenarioService.map$.subscribe({
            next: (m) => {
              m?.panInsideBounds(layer.getBounds(), {
                animate: true,
              });
            },
          });
          if (this._countries.length >= 0) {
            this._currentCountry$.next(this._countries[0]);
          } else {
            this.endGame();
          }
        }

        let label: L.Marker;
        this._scenarioService.map$.subscribe({
          next: (m) => {
            label = L.marker(layer.getBounds().getCenter(), {
              interactive: false,
              icon: L.divIcon({
                className: 'map-label',
                html: (layer as any).feature.properties.name,
                iconSize: [140, 20],
              }),
            }).addTo(this._layers$.value[0] as any);
          },
        });

        if (this.gameDifficulty !== GameDifficulty.EASY) {
          setTimeout(() => {
            layer.setStyle(
              this.gameDifficulty === GameDifficulty.HARD
                ? this._styleTransparent
                : this._styleNeutral
            );
            label.remove();
          }, 1000);
        }
      }
    }
  };

  public endGame() {
    this._currentCountry$.next({
      id: '',
      name: '',
    });

    this._score$.next(Math.max(Math.round(this._score), 0));
    this._time$.next(this._timer.time);
    this._gameStatus$.next(GameStatus.FINISHED);
  }
  private highlightFeature = (event: LayerEvent) => {
    const state = this._countries.find(
      (s) => s.id === event.target.feature.properties.iso_a3
    );
    if (
      (this.gameDifficulty === GameDifficulty.EASY && !!state) ||
      this.gameDifficulty === GameDifficulty.MEDIUM
    ) {
      const layer: FeatureGroup = event.target;
      layer.setStyle(this._styleNeutralHighlight);
    }
  };

  private revertStyle = (event: LayerEvent) => {
    const state = this._countries.find(
      (s) => s.id === event.target.feature.properties.iso_a3
    );
    if (
      (this.gameDifficulty === GameDifficulty.EASY && !!state) ||
      this.gameDifficulty === GameDifficulty.MEDIUM
    ) {
      const layer: FeatureGroup = event.target;
      layer.setStyle(this._styleNeutral);
    }
  };

  private onEachFeature = (f: GeoJSON.Feature, layer: Layer) => {
    this._featres.push(layer as any);

    layer.on({
      mousedown: () => {
        this._mouseDown = true;
      },

      mouseup: this.onCountryClick,
      mouseover: this.highlightFeature,
      mouseout: this.revertStyle,
    });
  };
}
