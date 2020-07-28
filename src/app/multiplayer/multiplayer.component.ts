import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultiplayerService, GAMELEVEL } from './services/multiplayer.service';
import { WebSocketService } from './services/web-socket.service';
import { Router } from '@angular/router';
import { routes } from '../shared/models/routes';
import { Subscription } from 'rxjs';
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
  destination = '/gamemode';
  otherPlayer = undefined;
  stateInfoSubscription: Subscription;
  playerDisconnectedSubscription: Subscription;
  roundOverSubscription: Subscription;
  endGameSubscription: Subscription;

  ngOnInit(): void {
    if (this.router.url === `/${routes.MULTIPLAYER}`) {
      this.multiplayerService.isMultiplayer = true;
    }
    this.webSocketService.startSockets();
    this.gameLevel = this.multiplayerService.stateInfo.gameLevel;
    this.roundOverSubscription = this.multiplayerService.roundOverListener().subscribe((roundOver: any) => {
      this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, ready: true };
    });
    this.stateInfoSubscription = this.multiplayerService.stateInfo$.subscribe((data) => {
      this.gameLevel = data.gameLevel;
    });
    this.playerDisconnectedSubscription = this.webSocketService.playerDisconnected$.subscribe((data) => {
      console.info('DISCONNECTED', data);
      if (data) {
        window.location.href = this.destination;
      }
    });
    this.endGameSubscription = this.multiplayerService.endGameListener().subscribe((data: string) => {
      const otherplayer = JSON.parse(data);
      this.multiplayerService._opponentScore.next(otherplayer);
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
    this.stateInfoSubscription.unsubscribe();
    this.playerDisconnectedSubscription.unsubscribe();
    this.roundOverSubscription.unsubscribe();
    this.endGameSubscription.unsubscribe();
  }
}
