import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { BehaviorSubject } from 'rxjs';

export enum GAMELEVEL {
  lobby = 'LOBBY',
  drawing = 'DRAWING',
  waitingForWord = 'WAITINGFORWORD',
  howToPlay = 'HOWTOPLAY',
}
export interface GameState {
  player: string | undefined;
  player_id: string | undefined;
  game_id: string | undefined;
  isReady: boolean | undefined;
  gameLevel: GAMELEVEL | undefined;
  guessUsed: number | undefined;
}

export interface PlayerInfo {
  player: string;
  player_id: string;
  game_id: string;
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
    player: undefined,
    gameLevel: GAMELEVEL.lobby,
    game_id: undefined,
    guessUsed: 0,
    isReady: false,
    player_id: undefined,
  };
  playerInfo: PlayerInfo;
  private readonly _stateInfo = new BehaviorSubject<GameState>(this.initialState);

  readonly stateInfo$ = this._stateInfo.asObservable();

  constructor(private webSocketService: WebSocketService) {}

  joinGame() {
    this.webSocketService.emit('joinGame', '');
    this.webSocketService.listen('joinGame').subscribe((data) => {
      console.log('joingame', data);
    });
    this.webSocketService.listen('player_info').subscribe((data: any) => {
      const el: PlayerInfo = JSON.parse(data);
      this.stateInfo.player = el.player;
      this.stateInfo.game_id = el.player_id;
      this.stateInfo.player_id = el.game_id;
    });
    this.webSocketService.listen('joinGame').subscribe((data: any) => {
      const el: StateInfo = JSON.parse(data);
      if (el.ready) {
        this.stateInfo = { ...this.stateInfo, isReady: el.ready, gameLevel: GAMELEVEL.howToPlay };
      }
    });
  }

  newRound() {
    console.log(this.stateInfo.game_id);
    const response = this.webSocketService.emit('newRound', JSON.stringify({ game_id: this.stateInfo.game_id }));
    console.log('emitted', response);
    this.webSocketService.listen('player_info').subscribe((data: any) => {
      const el: PlayerInfo = JSON.parse(data);
      console.log('PlayerInfo', el);
    });
    this.webSocketService.listen('state_info').subscribe((data: any) => {
      const el: StateInfo = JSON.parse(data);
      console.log('state_info', el);
    });
  }

  get stateInfo(): GameState {
    return this._stateInfo.getValue();
  }

  set stateInfo(val: GameState) {
    this._stateInfo.next(val);
  }
}
