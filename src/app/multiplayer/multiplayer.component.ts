import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultiplayerService, GAMELEVEL } from './services/multiplayer.service';
import { WebSocketService } from './services/web-socket.service';
@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss'],
})
export class MultiplayerComponent implements OnInit, OnDestroy {
  gameLevel: string | undefined;
  GAMELEVEL = GAMELEVEL;
  constructor(private multiplayerService: MultiplayerService, private webSocketService: WebSocketService) {}
  destination = '/';

  ngOnInit(): void {
    this.webSocketService.startSockets();
    this.gameLevel = this.multiplayerService.stateInfo.gameLevel;
    this.multiplayerService.stateInfo$.subscribe((data) => {
      this.gameLevel = data.gameLevel;
    });
    this.webSocketService.gameOver$.subscribe((data) => {
      if (data) {
        window.location.href = this.destination;
      }
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }
}
