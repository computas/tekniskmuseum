import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { routes } from '../../shared/models/routes';
import { Router } from '@angular/router';

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
  stateInfo: StateInfo;

  constructor(private webSocketService: WebSocketService, private router: Router) {}

  joinGame() {
    this.webSocketService.emit('joinGame', '');
    this.webSocketService.listen('player_info').subscribe((data: any) => {
      console.log(data);
      this.playerInfo = JSON.parse(data);
    });
    this.webSocketService.listen('state_info').subscribe((data: any) => {
      this.stateInfo = JSON.parse(data);
      if (this.stateInfo.Ready) {
        this.loading = false;
        this.goToGameInfo();
      }
    });
  }

  private goToGameInfo() {
    this.router.navigate([routes.MULTIPLAYER]);
  }
}
