import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { SocketEndpoints } from '../../../shared/models/websocketEndpoints';
import { PairingService } from './pairing.service';
import { JoinGameData, JoinGameReady, PredictionData } from '@/app/shared/models/backend-interfaces';
import { GAMELEVEL, GameState, PlayerScore } from '@/app/shared/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class MultiplayerService {
  public loading = true;
  public label = '';
  public isMultiplayer = false;
  roundIsOver = false;

  private initialState: GameState = {
    player_nr: undefined,
    gameLevel: GAMELEVEL.lobby,
    game_id: undefined,
    player_id: undefined,
    guessUsed: 0,
    ready: false,
    score: 0,
    label: undefined,
  };

  private readonly _stateInfo = new BehaviorSubject<GameState>(this.initialState);

  readonly stateInfo$ = this._stateInfo.asObservable();

  public _opponentScore = new ReplaySubject<any>(1);

  constructor(private webSocketService: WebSocketService, private pairing: PairingService) {}

  resetStateInfo() {
    this.stateInfo = this.initialState;
    this.isMultiplayer = false;
  }

  joinGame(difficulty_id: number) {
    this.webSocketService.emit(SocketEndpoints.JOIN_GAME, `{ "pair_id": "${this.pairing.getPairID()}", "difficulty_id": "${difficulty_id}"}`);
    return this.webSocketService.listen(SocketEndpoints.JOIN_GAME).pipe(
      tap((data: any) => {
        const el: GameState = data;
        if (el && el.game_id) {
          this.stateInfo = el;
        }
        if (el.ready) {
          this.stateInfo = { ...this.stateInfo, ready: el.ready, gameLevel: GAMELEVEL.howToPlay };
        }
      })
    );
  }

  getLabel(emit = true) {
    if (emit) {
      this.webSocketService.emit(SocketEndpoints.GET_LABEL, JSON.stringify({ game_id: this.stateInfo.game_id }));
    }
    return this.webSocketService.listen(SocketEndpoints.GET_LABEL).pipe(
      take(1),
      map((res: any) => {
        const data = JSON.parse(res);
        this.label = data;
        return this.label;
      })
    );
  }

  classify(data: { game_id?: string; time_left: number }, image: Blob) {
    this.webSocketService.emit(SocketEndpoints.CLASSIFY, data, image);
  }

  predictionListener() {
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
    this.isMultiplayer = false;
    this.webSocketService.disconnect();
  }

  changestate(gameLevel: GAMELEVEL) {
    this.stateInfo = {
      ...this.stateInfo,
      gameLevel,
    };
  }

  get stateInfo(): GameState {
    return this._stateInfo.getValue();
  }

  set stateInfo(val: GameState) {
    this._stateInfo.next(val);
  }
}
