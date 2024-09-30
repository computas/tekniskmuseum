import { GAMESTATE } from '@/app/shared/models/interfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameConfigService } from './game-config.service';

enum GAMEMODE {
  singleplayer = 'SINGLEPLAYER',
  multiplayer = 'MULTIPLAYER',
  notSet = 'NOTSET',
}

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private _currentRound = new BehaviorSubject<number>(0);
  private _gameMode = new BehaviorSubject<GAMEMODE>(GAMEMODE.notSet);
  private readonly _currentPage = new BehaviorSubject<GAMESTATE>(GAMESTATE.lobby);
  private _isGameOver = new BehaviorSubject<boolean>(false);

  readonly currentPage$ = this._currentPage.asObservable();

  constructor(private gameConfigService: GameConfigService) {
    const gameModeBeforeRefresh = localStorage.getItem('gameMode') as GAMEMODE;
    const pageBeforeRefresh = localStorage.getItem('currentPage') as GAMESTATE;
    const wasRefreshedMidGame =
      pageBeforeRefresh === GAMESTATE.intermediateResult ||
      pageBeforeRefresh === GAMESTATE.drawingBoard ||
      pageBeforeRefresh === GAMESTATE.showResult;

    if (wasRefreshedMidGame) {
      // all game progess will be lost - not saved in local store
      this.clearState();
      this.startGame();
      return;
    }
    if (gameModeBeforeRefresh) {
      this._gameMode.next(gameModeBeforeRefresh);
    }

    if (pageBeforeRefresh) {
      this.goToPage(pageBeforeRefresh);
    }
  }

  startGame() {
    if (this.isSingleplayer()) {
      this._currentRound.next(1);
    }
    this._currentPage.next(GAMESTATE.showWord);
  }

  replayGame() {
    if (this.isSingleplayer()) {
      this._currentRound.next(1);
    }
    this._currentPage.next(GAMESTATE.difficultyPicker);
  }

  endGame() {
    this._currentRound.next(0);
    this._currentPage.next(GAMESTATE.lobby);
    this._isGameOver.next(false);
  }

  clearState() {
    this._currentRound.next(0);
    this._isGameOver.next(false);
    this._gameMode.next(GAMEMODE.notSet);
    this.savePageToLocalStorage(GAMESTATE.homeScreen);
  }

  nextRound() {
    this._currentPage.next(GAMESTATE.showWord);
    this.updateRoundNumber();
  }

  updateRoundNumber() {
    this._currentRound.next(this._currentRound.value + 1);
  }

  setSingleplayer() {
    this._gameMode.next(GAMEMODE.singleplayer);
    this.saveGameModeToLocalStorage(GAMEMODE.singleplayer);
  }

  setMultiplayer() {
    this._gameMode.next(GAMEMODE.multiplayer);
    this.saveGameModeToLocalStorage(GAMEMODE.multiplayer);
    this.gameConfigService.setDifficultyLevel('medium'); 
  }

  restartGame() {
    const mode = this._gameMode.value;
    this._currentPage.next(GAMESTATE.lobby);
    this.clearState();
    if (mode === GAMEMODE.singleplayer) {
      this.setSingleplayer();
      this.replayGame();
    } else if (mode === GAMEMODE.multiplayer) {
      this.setMultiplayer();
    }
  }

  savePageToLocalStorage(newState: GAMESTATE) {
    // TODO should this be logged to console?
    localStorage.setItem('currentPage', newState); // save in case of page refresh
  }

  saveGameModeToLocalStorage(gameMode: GAMEMODE) {
    localStorage.setItem('gameMode', gameMode);
  }

  showSummary() {
    this.goToPage(GAMESTATE.showResult);
  }

  goToPage(page: GAMESTATE) {
    this._currentPage.next(page);
    this.savePageToLocalStorage(page);
  }

  isGameOver(): boolean {
    const roundsInGame = this.gameConfigService.getConfig.rounds;
    return this._currentRound.value === roundsInGame;
  }
  isSingleplayer(): boolean {
    return this._gameMode.value === GAMEMODE.singleplayer;
  }

  isMultiplayer(): boolean {
    return this._gameMode.value === GAMEMODE.multiplayer;
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

  getDifficulty(): number {
    return this.gameConfigService.getConfig.difficultyId;
  }
}
