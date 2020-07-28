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
  destination = '/';
  otherPlayer = undefined;
  subs = new Subscription();

  ngOnInit(): void {
    if (this.router.url === `/${routes.MULTIPLAYER}`) {
      this.multiplayerService.isMultiplayer = true;
    }
    this.webSocketService.startSockets();
    this.gameLevel = this.multiplayerService.stateInfo.gameLevel;
    this.subs.add(
      this.multiplayerService.roundOverListener().subscribe((roundOver: any) => {
        this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, ready: true };
      })
    );
    this.subs.add(
      this.multiplayerService.stateInfo$.subscribe((data) => {
        this.gameLevel = data.gameLevel;
      })
    );
    this.subs.add(
      this.webSocketService.playerDisconnected$.subscribe((data) => {
        console.warn('DISCONNECTED', data);
        if (data) {
          window.location.href = this.destination;
        }
      })
    );
    this.subs.add(
      this.multiplayerService.endGameListener().subscribe((data: string) => {
        const otherplayer = JSON.parse(data);
        this.multiplayerService._opponentScore.next(otherplayer);
      })
    );
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
    this.multiplayerService.resetStateInfo();
    this.subs.unsubscribe();
  }
}
