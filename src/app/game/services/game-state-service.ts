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
  private _currentRound = new BehaviorSubject<number>(0);
  private _gameMode = new BehaviorSubject<GAMEMODE>(GAMEMODE.multiplayer);
  private readonly _currentPage = new BehaviorSubject<GAMESTATE>(GAMESTATE.lobby);
  private _isGameOver = new BehaviorSubject<boolean>(false);

  private _currentRound$ = this._currentRound.asObservable();
  private _gameMode$ = this._gameMode.asObservable();
  private _isGameOver$ = this._isGameOver.asObservable();

  readonly currentPage$ = this._currentPage.asObservable();

  constructor(private gameConfigService: GameConfigService) {
    const pageBeforeRefresh = localStorage.getItem('currentPage') as GAMESTATE;
    if (pageBeforeRefresh) {
      this.setCurrentPage(pageBeforeRefresh);
    }
  }

  startGame() {
    this._currentRound.next(1);
    this._currentPage.next(GAMESTATE.showWord);
  }

  endGame() {
    this._currentRound.next(0);
    this._isGameOver.next(false);
  }

  clearState() {
    this._currentRound.next(0);
    this._isGameOver.next(false);
    this._gameMode.next(GAMEMODE.multiplayer);
    this.setCurrentPage(GAMESTATE.lobby);
  }

  nextRound() {
    this._currentPage.next(GAMESTATE.showWord);
  }

  updateRoundNumber() {
    this._currentRound.next(this._currentRound.value + 1);
    console.log('ROUNDNUMBER: ' + this._currentRound.value);
  }

  setSingleplayer() {
    this._gameMode.next(GAMEMODE.singleplayer);
  }

  setMultiplayer() {
    this._gameMode.next(GAMEMODE.multiplayer);
  }

  setCurrentPage(newState: GAMESTATE) {
    // TODO should this be logged to console?
    localStorage.setItem('currentPage', newState); // save in case of page refresh
    this._currentPage.next(newState);
  }

  // look further into this logic later
  isGameOver(): boolean {
    const numberOfRounds = this.gameConfigService.getConfig.rounds;
    return this._currentRound.value === numberOfRounds;
  }

  getCurrentRound(): number {
    return this._currentRound.value;
  }

  getGameMode(): GAMEMODE {
    return this._gameMode.value;
  }

  getCurrentPage(): GAMESTATE {
    return this._currentPage.value;
  }
}
