import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { routes } from '../../shared/models/routes';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject, Observer } from 'rxjs';

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

  playerInfo: PlayerInfo;
  private readonly _stateInfo = new BehaviorSubject<StateInfo>({ Ready: false });

  readonly stateInfo$ = this._stateInfo.asObservable();

  constructor(private webSocketService: WebSocketService, private router: Router) {}

  joinGame() {
    this.webSocketService.emit('joinGame', '');
    this.webSocketService.listen('player_info').subscribe((data: any) => {
      this.playerInfo = JSON.parse(data);
    });
    this.webSocketService.listen('state_info').subscribe((data: any) => {
      this.stateInfo = JSON.parse(data);
    });
  }

  get stateInfo(): StateInfo {
    return this._stateInfo.getValue();
  }

  set stateInfo(val: StateInfo) {
    this._stateInfo.next(val);
  }
}
