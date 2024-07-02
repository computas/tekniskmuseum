import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { MultiplayerService } from './services/multiplayer.service';
import { WebSocketService } from './services/web-socket.service';
import { routes } from '../../shared/models/routes';
import { Subscription } from 'rxjs';
import { LobbyComponent } from './lobby/lobby.component';
import { GameResultComponent } from '../game-result/game-result.component';
import { GameIntermediateResultComponent } from '../game-intermediate-result/game-intermediate-result.component';
import { GameDrawComponent } from '../game-draw/game-draw.component';
import { GameWordToDrawComponent } from '../game-word-to-draw/game-word-to-draw.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { GAMELEVEL } from '@/app/shared/models/interfaces';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }),
        style({ right: '-100%', opacity: 0 }),
        animate('.4s ease-out', style({ right: '0%', opacity: 1 })),
      ]),
      transition(':leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }),
        animate('.4s ease-out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ]),
    ]),
  ],
  standalone: true,
  imports: [
    GameInfoComponent,
    GameWordToDrawComponent,
    GameDrawComponent,
    GameIntermediateResultComponent,
    GameResultComponent,
    LobbyComponent,
  ],
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
      this.multiplayerService.roundOverListener().subscribe(() => {
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
