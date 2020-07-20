import { Component, OnInit } from '@angular/core';
import { MultiplayerService } from '../services/multiplayer.service';
import { WebSocketService } from '../services/web-socket.service';
import { GameInfo } from '../services/game-info';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
  loading = true;

  gameInfo: GameInfo;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.emit('joinGame', '');
    this.webSocketService.listen('message').subscribe((data: any) => {
      this.gameInfo = JSON.parse(data);
      if (this.gameInfo) {
        this.loading = false;
      }
      console.log(data);
    });
  }
}
