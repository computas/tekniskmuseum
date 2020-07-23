import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { BehaviorSubject } from 'rxjs';

export enum GAMELEVEL {
  lobby = 'LOBBY',
  drawing = 'DRAWING',
  intermediateResult = 'INTERMEDIATERESULT',
  waitingForWord = 'WAITINGFORWORD',
  howToPlay = 'HOWTOPLAY',
}
export interface GameState {
  player_nr: string | undefined;
  player_id: string | undefined;
  game_id: string | undefined;
  ready: boolean | undefined;
  gameLevel: GAMELEVEL | undefined;
  guessUsed: number | undefined;
}
export interface StateInfo {
  ready: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class MultiplayerService {
  public loading = true;
  private initialState: GameState = {
    player_nr: undefined,
    gameLevel: GAMELEVEL.lobby,
    game_id: undefined,
    player_id: undefined,
    guessUsed: 0,
    ready: false,
  };

  private readonly _stateInfo = new BehaviorSubject<GameState>(this.initialState);

  readonly stateInfo$ = this._stateInfo.asObservable();

  constructor(private webSocketService: WebSocketService) {}

  joinGame() {
    this.webSocketService.emit('joinGame', '');
    this.webSocketService.listen('joinGame').subscribe((data: any) => {
      const el: GameState = JSON.parse(data);
      if (el && el.game_id) {
        this.stateInfo = el;
      }
      if (el.ready) {
        this.stateInfo = { ...this.stateInfo, ready: el.ready, gameLevel: GAMELEVEL.howToPlay };
      }
    });
  }

  getLabel() {
    const response = this.webSocketService.emit('getLabel', JSON.stringify({ game_id: this.stateInfo.game_id }));
    this.webSocketService.listen('getLabel').subscribe((data: any) => {});
  }

  get stateInfo(): GameState {
    return this._stateInfo.getValue();
  }

  set stateInfo(val: GameState) {
    this._stateInfo.next(val);
  }
}
