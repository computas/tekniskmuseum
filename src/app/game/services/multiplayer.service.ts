import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { SocketEndpoints } from '@/app/shared/models/websocketEndpoints';
import { PairingService } from './pairing.service';
import { JoinGameData, JoinGameReady, PredictionData } from '@/app/shared/models/backend-interfaces';
import { GAMESTATE, GameState, PlayerScore } from '@/app/shared/models/interfaces';
import { TranslationService } from '@/app/core/translation.service';
import { GameStateService } from './game-state-service';

@Injectable({
  providedIn: 'root',
})
export class MultiplayerService {
  public loading = true;
  public label = '';
  roundIsOver = false;

  private initialState: GameState = {
    player_nr: undefined,
    gameState: GAMESTATE.lobby,
    game_id: undefined,
    player_id: undefined,
    guessUsed: 0,
    ready: false,
    score: 0,
    label: undefined,
  };

  private readonly _stateInfo = new BehaviorSubject<GameState>(this.initialState);

  readonly stateInfo$ = this._stateInfo.asObservable();

  public opponentScore = new ReplaySubject<PlayerScore>(1);

  constructor(
    private gameStateService: GameStateService,
    private webSocketService: WebSocketService,
    private pairing: PairingService,
    private translationService: TranslationService
  ) {}

  resetStateInfo() {
    this.stateInfo = this.initialState;
  }

  joinGame(difficulty_id: number) {
    this.webSocketService.emit(
      SocketEndpoints.JOIN_GAME,
      `{ "pair_id": "${this.pairing.getPairID()}", "difficulty_id": "${difficulty_id}"}`
    );
    return this.webSocketService.listen(SocketEndpoints.JOIN_GAME).pipe(
      tap((data: string | JoinGameData | JoinGameReady) => {
        const el: GameState = data as GameState;
        if (el && el.game_id) {
          this.stateInfo = el;
        }
        if (el.ready) {
          this.stateInfo = { ...this.stateInfo, ready: el.ready, gameState: GAMESTATE.howToPlay };
          this.gameStateService.goToPage(GAMESTATE.howToPlay);
        }
      })
    );
  }

  getLabel(emit = true): Observable<string> {
    const currentLang = this.translationService.getCurrentLang();
    if (emit) {
      this.webSocketService.emit(SocketEndpoints.GET_LABEL, JSON.stringify({ game_id: this.stateInfo.game_id }));
    }
    return this.webSocketService.listen(SocketEndpoints.GET_LABEL).pipe(
      take(1),
      map((res: string) => {
        const data = JSON.parse(res);
        const label = data['label'];
        const norwegian_label = data['norwegian_label'];
        if (currentLang === 'EN') {
          this.label = label;
          return label;
        } else {
          this.label = norwegian_label;
          return norwegian_label;
        }
      })
    );
  }

  classify(data: { game_id?: string; time_left: number }, image: Blob) {
    this.webSocketService.emit(SocketEndpoints.CLASSIFY, data, image);
  }

  predictionListener(): Observable<PredictionData> {
    return this.webSocketService.listen(SocketEndpoints.PREDICTION);
  }

  roundOverListener() {
    return this.webSocketService.listen(SocketEndpoints.ROUND_OVER);
  }

  endGameListener() {
    return this.webSocketService.listen(SocketEndpoints.END_GAME);
  }

  endGame() {
    const result = JSON.stringify({
      game_id: this.stateInfo.game_id,
      score: this.stateInfo.score,
      player_id: this.stateInfo.player_id,
    });
    this.webSocketService.emit(SocketEndpoints.END_GAME, result);
  }

  clearState() {
    this.stateInfo = this.initialState;
    this.webSocketService.disconnect();
  }

  changestate(gameState: GAMESTATE) {
    this.stateInfo = {
      ...this.stateInfo,
      gameState,
    };
  }

  get stateInfo(): GameState {
    return this._stateInfo.getValue();
  }

  set stateInfo(val: GameState) {
    this._stateInfo.next(val);
  }
}
