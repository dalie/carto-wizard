import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeatureCollection } from 'geojson';
import * as L from 'leaflet';
import { FeatureGroup, geoJSON, Layer, LayerEvent } from 'leaflet';
import { Duration } from 'luxon';
import { BehaviorSubject } from 'rxjs';
import { TimerService } from 'src/app/timer/timer.service';
import { ScenarioService } from '../scenario.service';
import { Scenario, scenarios } from '../scenarios';

interface ScenarioFeature {
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
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScenarioComponent implements OnInit {
  private _mouseDown = false;
  private _geoJsonfeatures: FeatureGroup[] = [];
  private _score = 0;
  private _score$ = new BehaviorSubject<number>(-1);
  private _time$ = new BehaviorSubject<Duration>(Duration.fromMillis(0));
  private _gameStatus$ = new BehaviorSubject<GameStatus>(GameStatus.LOBBY);
  private _layers$ = new BehaviorSubject<Layer[]>([]);

  private _scenarioFeatures: ScenarioFeature[] = [];
  private _currentFeature$ = new BehaviorSubject<ScenarioFeature>({
    id: '',
    name: '',
  });

  private _currentScenario$ = new BehaviorSubject<Scenario | undefined>(
    undefined
  );

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
  currentFeature$ = this._currentFeature$.asObservable();
  currentScenario$ = this._currentScenario$.asObservable();

  gameStatus$ = this._gameStatus$.asObservable();
  layers$ = this._layers$.asObservable();
  time$ = this._time$.asObservable();

  gameDifficultyControl = new FormControl(GameDifficulty.EASY);

  get gameDifficulty(): GameDifficulty {
    return this.gameDifficultyControl.value;
  }

  constructor(
    private readonly _http: HttpClient,
    private readonly _route: ActivatedRoute,
    private readonly _scenarioService: ScenarioService,
    private readonly _timer: TimerService
  ) {}

  ngOnInit(): void {
    const scenarioId = this._route.snapshot.params['scenarioId'];
    if (scenarioId) {
      this._currentScenario$.next(scenarios.find((s) => s.id === scenarioId));
      this._scenarioService.map$.subscribe({
        next: (m) => {
          m?.setView(
            this._currentScenario$.value?.center as any,
            this._currentScenario$.value?.zoom || 4
          );
        },
      });
    }
  }

  startGame() {
    if (this._currentScenario$.value) {
      this._http
        .get(`./assets/geojson/${this._currentScenario$.value?.id}.json`)
        .subscribe({
          next: (data: any) => {
            // data.features = (data as FeatureCollection).features.filter(
            //   (f) => f.properties?.continent === 'South America'
            // );
            let idCount = 0;
            (data as FeatureCollection).features.forEach((f) => {
              f.id = idCount++;
              // f.properties = {
              //   name: f.properties?.name,
              //   continent: f.properties?.continent,
              // };
            });
            // console.log(JSON.stringify(data));

            this._scenarioFeatures = (data as FeatureCollection).features
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
                style:
                  this.gameDifficulty !== GameDifficulty.HARD
                    ? this._styleNeutral
                    : this._styleTransparent,
                onEachFeature: this.onEachFeature,
              }),
            ]);
            this._score = 0;
            this._currentFeature$.next(this._scenarioFeatures[0]);
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
  }

  private onFeatureClick = (event: LayerEvent) => {
    if (this._mouseDown) {
      this._mouseDown = false;
      const featureId = event.target.feature.id;
      if (
        this.gameDifficulty !== GameDifficulty.EASY ||
        this._scenarioFeatures.find((f) => f.id === featureId)
      ) {
        let layer: FeatureGroup = event.target;
        if (featureId === this._currentFeature$.value.id) {
          layer.setStyle(this._styleCorrect);
          this._scenarioFeatures = this._scenarioFeatures.filter(
            (f) => f.id !== featureId
          );
          this._score += 100 * this.gameDifficulty;
          if (this._scenarioFeatures.length) {
            this._currentFeature$.next(this._scenarioFeatures[0]);
          } else {
            this.endGame();
          }
        } else {
          layer = this._geoJsonfeatures.find(
            (f) => (<any>f).feature.id === this._currentFeature$.value.id
          ) as any;

          layer.setStyle(this._styleWrong);
          this._scenarioFeatures = this._scenarioFeatures.filter(
            (f) => f.id !== this._currentFeature$.value.id
          );
          this._scenarioService.map$.subscribe({
            next: (m) => {
              m?.panInsideBounds(layer.getBounds(), {
                animate: true,
              });
            },
          });
          if (this._scenarioFeatures.length >= 0) {
            this._currentFeature$.next(this._scenarioFeatures[0]);
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
    this._currentFeature$.next({
      id: '',
      name: '',
    });

    this._score$.next(Math.max(Math.round(this._score), 0));
    this._time$.next(this._timer.time);
    this._gameStatus$.next(GameStatus.FINISHED);
  }
  private highlightFeature = (event: LayerEvent) => {
    const state = this._scenarioFeatures.find(
      (f) => f.id === event.target.feature.id
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
    const state = this._scenarioFeatures.find(
      (f) => f.id === event.target.feature.id
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
    this._geoJsonfeatures.push(layer as any);

    layer.on({
      mousedown: () => {
        this._mouseDown = true;
      },

      mouseup: this.onFeatureClick,
      mouseover: this.highlightFeature,
      mouseout: this.revertStyle,
    });
  };
}
