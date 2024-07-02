import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { MultiplayerService } from '../game-multiplayer/services/multiplayer.service';
import { WebSocketService } from '../game-multiplayer/services/web-socket.service';
import { SocketEndpoints } from '../../shared/models/websocketEndpoints';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { DrawingService } from '../game-draw/services/drawing.service';
import { TranslationService } from '@/app/services/translation.service';
import { TranslatePipe } from '@/app/pipes/translation.pipe';
import { GAMELEVEL } from '@/app/shared/models/interfaces';

@Component({
  selector: 'app-game-pick-difficulty',
  templateUrl: './game-pick-difficulty.component.html',
  styleUrl: './game-pick-difficulty.component.scss',
  standalone: true,
  imports: [NgIf, MatIcon, MatButton, TranslatePipe],
})
export class GamePickDifficultyComponent implements OnInit {
  @Output() getDrawWord = new EventEmitter();

  isSinglePlayer = false;
  isMultiPlayer = false;

  constructor(
    private drawingService: DrawingService,
    private router: Router,
    private multiplayerService: MultiplayerService,
    private webSocketService: WebSocketService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
    } else {
      this.isMultiPlayer = true;
      this.multiplayerService.getLabel(false).subscribe((res: string) => {
        if (res) {
          this.multiplayerService.stateInfo = {
            ...this.multiplayerService.stateInfo,
            label: res,
            gameLevel: GAMELEVEL.waitingForWord,
          };
        }
      });
      this.webSocketService.listen(SocketEndpoints.END_GAME).subscribe();
    }
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
  }

  setDifficulty(difficulty: number) {
    this.drawingService.difficulty = difficulty;
  }

  startDrawing(difficulty: number) {
    if (this.isSinglePlayer) {
      this.setDifficulty(difficulty);
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
