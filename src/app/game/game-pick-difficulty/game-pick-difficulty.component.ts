import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { MultiplayerService, GAMELEVEL } from '../game-multiplayer/services/multiplayer.service';
import { WebSocketService } from '../game-multiplayer/services/web-socket.service';
import { SocketEndpoints } from '../../shared/models/websocketEndpoints';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { DrawingService } from '../game-draw/services/drawing.service';

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
  @Output() getDrawWord = new EventEmitter();

  isSinglePlayer = false;
  isMultiPlayer = false;

  constructor(
    private drawingService: DrawingService,
    private router: Router,
    private multiplayerService: MultiplayerService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
    } else {
      this.isMultiPlayer = true;
      this.multiplayerService.getLabel(false).subscribe((res: any) => {
        if (res) {
          this.multiplayerService.stateInfo = {
            ...this.multiplayerService.stateInfo,
            label: res.label,
            gameLevel: GAMELEVEL.waitingForWord,
          };
        }
      });
      this.webSocketService.listen(SocketEndpoints.END_GAME).subscribe();
    }
  }
  
  setDifficulty(difficulty: number) {
    this.drawingService.difficulty = difficulty;
  }
  
  startDrawing(difficulty: number) {
    if (this.isSinglePlayer) {
      this.setDifficulty(difficulty)
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
