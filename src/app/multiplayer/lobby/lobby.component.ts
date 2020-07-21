import { Component, OnInit } from '@angular/core';
import { MultiplayerService } from '../services/multiplayer.service';
import { WebSocketService } from '../services/web-socket.service';
import { routes } from '../../shared/models/routes';
import { Router } from '@angular/router';

export interface PlayerInfo {
  player_id: string;
  game_id: string;
}
export interface StateInfo {
  Ready: boolean;
}

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
  loading = true;

  playerInfo: PlayerInfo;
  stateInfo: StateInfo;

  constructor(private webSocketService: WebSocketService, private router: Router) {}

  ngOnInit(): void {
    this.webSocketService.emit('joinGame', '');
    this.webSocketService.listen('player_info').subscribe((data: any) => {
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

  goToGameInfo() {
    this.router.navigate([routes.MULTIPLAYER]);
  }
}
