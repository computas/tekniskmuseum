import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { MultiplayerService } from '../services/multiplayer.service';
import { WebSocketService } from '../services/web-socket.service';
import { Subscription } from 'rxjs';
import { LobbyComponent } from './lobby/lobby.component';
import { GameResultComponent } from '../game-result/game-result.component';
import { GameIntermediateResultComponent } from '../game-intermediate-result/game-intermediate-result.component';
import { GameDrawComponent } from '../game-draw/game-draw.component';
import { GameWordToDrawComponent } from '../game-word-to-draw/game-word-to-draw.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { GAMESTATE } from '@/app/shared/models/interfaces';
import { GameStateService } from '../services/game-state-service';

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
  gameState: string | undefined;
  GAMESTATE = GAMESTATE;
  constructor(
    private gameStateService: GameStateService,
    private multiplayerService: MultiplayerService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {
    this.initializeComponent = this.initializeComponent.bind(this);
  }
  destination = '/';
  otherPlayer = undefined;
  subs = new Subscription();

  ngOnInit(): void {
    this.initializeComponent();
  }

  initializeComponent(): void {
    this.webSocketService.startSockets();
    this.gameState = this.multiplayerService.stateInfo.gameState;
    this.subs.add(
      this.gameStateService.currentPage$.subscribe((page) => {
        this.gameState = page;
      })
    );
    this.subs.add(
      this.multiplayerService.roundOverListener().subscribe(() => {
        this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, ready: true };
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
        this.multiplayerService.opponentScore.next(otherplayer);
      })
    );
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
    this.multiplayerService.clearState();
    this.subs.unsubscribe();
  }
}
