import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultiplayerService, GAMELEVEL } from './services/multiplayer.service';
import { WebSocketService } from './services/web-socket.service';
import { Router } from '@angular/router';
import { routes } from '../shared/models/routes';
@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss'],
})
export class MultiplayerComponent implements OnInit, OnDestroy {
  gameLevel: string | undefined;
  GAMELEVEL = GAMELEVEL;
  constructor(
    private multiplayerService: MultiplayerService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {}
  destination = '/';

  ngOnInit(): void {
    if (this.router.url === `/${routes.MULTIPLAYER}`) {
      this.multiplayerService.isMultiplayer = true;
    }
    this.webSocketService.startSockets();
    this.gameLevel = this.multiplayerService.stateInfo.gameLevel;
    this.multiplayerService.roundOverListener().subscribe((roundOver: any) => {
      console.warn('round is over', roundOver);
      if (roundOver.round_over) {
        this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, ready: true };
      }
    });
    this.multiplayerService.stateInfo$.subscribe((data) => {
      this.gameLevel = data.gameLevel;
    });
    this.webSocketService.playerDisconnected$.subscribe((data) => {
      if (data) {
        window.location.href = this.destination;
      }
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }
}
