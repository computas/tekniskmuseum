import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { SocketEndpoints } from '../../../shared/models/websocketEndpoints';
import { environment } from '../../../../environments/environment';

export enum GAMELEVEL {
  lobby = 'LOBBY',
  drawing = 'DRAWING',
  intermediateResult = 'INTERMEDIATERESULT',
  waitingForWord = 'WAITINGFORWORD',
  howToPlay = 'HOWTOPLAY',
  showResult = 'SHOWRESULT',
}
export interface GameState {
  player_nr: string | undefined;
  player_id: string | undefined;
  game_id: string | undefined;
  ready: boolean | undefined;
  gameLevel: GAMELEVEL | undefined;
  guessUsed: number | undefined;
  score: number | undefined;
  label: string | undefined;
}
export interface StateInfo {
  ready: boolean;
}
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

  constructor(private webSocketService: WebSocketService) {}

  resetStateInfo() {
    this.stateInfo = this.initialState;
  }

  joinGame() {
    this.webSocketService.emit(SocketEndpoints.JOIN_GAME,{"pair_id": environment.PAIR_ID});
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
        this.label = data.label;
        return this.label;
      })
    );
  }

  classify(data, image) {
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

  endGame(score) {
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

  changestate(gameLevel: GAMELEVEL, ...rest) {
    this.stateInfo = {
      ...this.stateInfo,
      ...rest,
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
