import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { MultiplayerService, GAMESTATE } from '../game-multiplayer/services/multiplayer.service';
import { WebSocketService } from '../game-multiplayer/services/web-socket.service';
import { SocketEndpoints } from '../../shared/models/websocketEndpoints';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { GameConfig, GameConfigService } from '../game-config.service';


@Component({
    selector: 'app-game-pick-difficulty',
    templateUrl: './game-pick-difficulty.component.html',
    styleUrl: './game-pick-difficulty.component.scss',
    standalone: true,
    imports: [
      NgIf,
      MatIcon,
      MatButton,
  ],
})
export class GamePickDifficultyComponent {
  config = this.gameConfigService.getConfig; 
  
  isSinglePlayer = false;
  isMultiPlayer = false;

  @Output() getDrawWord = new EventEmitter();
  @Output() difficultyPicked = new EventEmitter();

  constructor(
    private gameConfigService: GameConfigService, 
    private router: Router,
    private multiplayerService: MultiplayerService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
      this.gameConfigService.config$.subscribe((config: GameConfig) => {
        this.config = config;
      });
    } else {
      this.isMultiPlayer = true;
      this.multiplayerService.getLabel(false).subscribe((res: any) => {
        if (res) {
          this.multiplayerService.stateInfo = {
            ...this.multiplayerService.stateInfo,
            label: res.label,
            gameState: GAMESTATE.waitingForWord,
          };
        }
      });
      this.webSocketService.listen(SocketEndpoints.END_GAME).subscribe();
    }
  }  


  startDrawing(difficulty: string) {
    if (this.isSinglePlayer) {
      this.gameConfigService.setDifficultyLevel(difficulty);
      this.getDrawWord.emit(true);
    } else {
      //TODO: Add difficulty in multiplayerService, this is not implemented
      this.multiplayerService.getLabel(true);
    }
  }

  
  goToLanding() {
    this.router.navigate([routes.LANDING]);
  }

}
