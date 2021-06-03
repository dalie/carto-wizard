import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameDifficulty, GameMode, GameState } from './game.models';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _currentState = {
    difficulty: GameDifficulty.Easy,
    mode: GameMode.Find,
    highScores: [],
  };
  private _highscoresKey = 'highscores';
  private _gameState$ = new BehaviorSubject<GameState>(this._currentState);

  gameState$ = this._gameState$.asObservable();

  constructor() {
    const highscoreData = localStorage.getItem(this._highscoresKey) || '';

    if (highscoreData) {
      this._currentState.highScores = JSON.parse(highscoreData);
      this._gameState$.next(this._currentState);
    }
  }
}
