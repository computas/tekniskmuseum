import { GAMESTATE } from '@/app/shared/models/interfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameConfigService } from './game-config.service';

enum GAMEMODE {
  singleplayer = 'SINGLEPLAYER',
  multiplayer = 'MULTIPLAYER',
}

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private _currentRound = new BehaviorSubject<number>(1);
  private _gameMode = new BehaviorSubject<GAMEMODE>(GAMEMODE.singleplayer);
  private _gameState = new BehaviorSubject<GAMESTATE>(GAMESTATE.lobby);
  private _isGameOver = new BehaviorSubject<boolean>(false);

  private _currentRound$ = this._currentRound.asObservable();
  private _gameState$ = this._gameState.asObservable();
  private _gameMode$ = this._gameMode.asObservable();
  private _isGameOver$ = this._isGameOver.asObservable();

  constructor(private gameConfigService: GameConfigService) {}

  startGame() {
    this._currentRound.next(1);
  }

  endGame() {
    this._currentRound.next(0);
    this._isGameOver.next(false);
  }

  nextRound() {
    this._currentRound.next(this._currentRound.value + 1);
  }

  setSinglePlayer() {
    this._gameMode.next(GAMEMODE.singleplayer);
  }

  setMultiplayer() {
    this._gameMode.next(GAMEMODE.multiplayer);
  }

  setGameState(newState: GAMESTATE) {
    // TODO should this be logged to console?
    this._gameState.next(newState);
  }

  // look further into this logic later
  isGameOver() {
    const numberOfRounds = this.gameConfigService.getConfig.rounds;
    this._currentRound.value === numberOfRounds;
  }

  getCurrentRound(): number {
    return this._currentRound.value;
  }

  getGameMode(): GAMEMODE {
    return this._gameMode.value;
  }

  getGameState(): GAMESTATE {
    return this._gameState.value;
  }
}
