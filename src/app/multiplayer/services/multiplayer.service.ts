import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { routes } from '../../shared/models/routes';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject, Observer } from 'rxjs';

enum GAMELEVEL {
  lobby = 'LOBBY',
  drawing = 'DRAWING',
  waitingForWord = 'WAITINGFORWORD',
  howToPlay = 'HOWTOPLAY',
}
export interface GameState {
  player_id: string | undefined;
  game_id: string | undefined;
  isReady: boolean | undefined;
  gameLevel: GAMELEVEL | undefined;
  guessUsed: number | undefined;
}

export interface PlayerInfo {
  player_id: string;
  game_id: string;
}
export interface StateInfo {
  Ready: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class MultiplayerService {
  public loading = true;
  private initialState: GameState = {
    gameLevel: GAMELEVEL.lobby,
    game_id: undefined,
    guessUsed: 0,
    isReady: false,
    player_id: undefined,
  };
  playerInfo: PlayerInfo;
  private readonly _stateInfo = new BehaviorSubject<GameState>(this.initialState);

  readonly stateInfo$ = this._stateInfo.asObservable();

  constructor(private webSocketService: WebSocketService, private router: Router) {}

  joinGame() {
    this.webSocketService.emit('joinGame', '');
    this.webSocketService.listen('player_info').subscribe((data: any) => {
      const el: PlayerInfo = JSON.parse(data);
      this.stateInfo.game_id = el.player_id;
      this.stateInfo.player_id = el.game_id;
    });
    this.webSocketService.listen('state_info').subscribe((data: any) => {
      const el: StateInfo = JSON.parse(data);
      this.stateInfo.isReady = el.Ready;
      if (el.Ready) {
        this.stateInfo.gameLevel = GAMELEVEL.howToPlay;
      }
    });
  }

  get stateInfo(): GameState {
    return this._stateInfo.getValue();
  }

  set stateInfo(val: GameState) {
    this._stateInfo.next(val);
  }
}
