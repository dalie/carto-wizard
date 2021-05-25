import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FeatureCollection } from 'geojson';
import { FeatureGroup, geoJSON, Layer, LayerEvent, LayerGroup } from 'leaflet';
import { Duration } from 'luxon';
import { BehaviorSubject } from 'rxjs';
import { TimerService } from 'src/app/timer/timer.service';

interface State {
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
  selector: 'app-us-states',
  templateUrl: './us-states.component.html',
  styleUrls: ['./us-states.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsStatesComponent implements OnInit {
  private _featres: FeatureGroup[] = [];
  private _score = 0;
  private _score$ = new BehaviorSubject<number>(-1);
  private _time$ = new BehaviorSubject<Duration>(Duration.fromMillis(0));
  private _gameStatus$ = new BehaviorSubject<GameStatus>(GameStatus.LOBBY);
  private _layers$ = new BehaviorSubject<Layer[]>([]);

  private _states: State[] = [];
  private _currentState$ = new BehaviorSubject<State>({
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
  currentState$ = this._currentState$.asObservable();

  gameStatus$ = this._gameStatus$.asObservable();
  layers$ = this._layers$.asObservable();
  time$ = this._time$.asObservable();

  gameDifficultyControl = new FormControl(GameDifficulty.EASY);

  get gameDifficulty(): GameDifficulty {
    return this.gameDifficultyControl.value;
  }

  constructor(
    private readonly _http: HttpClient,
    private readonly _timer: TimerService
  ) {}

  ngOnInit(): void {}

  startGame() {
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
            style:
              this.gameDifficulty !== GameDifficulty.HARD
                ? this._styleNeutral
                : this._styleTransparent,
            onEachFeature: this.onEachFeature,
          }),
        ]);
        this._score = 0;
        this._currentState$.next(this._states[0]);
        this._gameStatus$.next(GameStatus.STARTED);
      },
    });
  }

  private onStateClick = (event: LayerEvent) => {
    const stateId = event.target.feature.id;
    if (
      this.gameDifficulty !== GameDifficulty.EASY ||
      this._states.find((s) => s.id === stateId)
    ) {
      let layer: FeatureGroup = event.target;
      if (stateId === this._currentState$.value.id) {
        layer.setStyle(this._styleCorrect);
        this._states = this._states.filter((s) => s.id !== stateId);
        this._score += 100 * this.gameDifficulty;
        if (this._states.length) {
          this._currentState$.next(this._states[0]);
        } else {
          this.endGame();
        }
      } else {
        layer = this._featres.find(
          (f) => (<any>f).feature.id === this._currentState$.value.id
        ) as any;

        layer.setStyle(this._styleWrong);
        this._states = this._states.filter(
          (s) => s.id !== this._currentState$.value.id
        );

        if (this._states.length >= 0) {
          this._currentState$.next(this._states[0]);
        } else {
          this.endGame();
        }
      }

      if (this.gameDifficulty !== GameDifficulty.EASY) {
        setTimeout(() => {
          layer.setStyle(
            this.gameDifficulty === GameDifficulty.HARD
              ? this._styleTransparent
              : this._styleNeutral
          );
        }, 1000);
      }
    }
  };

  private endGame() {
    this._currentState$.next({
      id: '',
      name: '',
    });

    this._score$.next(Math.max(Math.round(this._score), 0));
    this._time$.next(this._timer.time);
    this._gameStatus$.next(GameStatus.FINISHED);
  }
  private highlightFeature = (event: LayerEvent) => {
    const state = this._states.find((s) => s.id === event.target.feature.id);
    if (
      (this.gameDifficulty === GameDifficulty.EASY && !!state) ||
      this.gameDifficulty === GameDifficulty.MEDIUM
    ) {
      const layer: FeatureGroup = event.target;
      layer.setStyle(this._styleNeutralHighlight);
    }
  };

  private revertStyle = (event: LayerEvent) => {
    const state = this._states.find((s) => s.id === event.target.feature.id);
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
      mouseup: this.onStateClick,
      mouseover: this.highlightFeature,
      mouseout: this.revertStyle,
    });
  };
}
