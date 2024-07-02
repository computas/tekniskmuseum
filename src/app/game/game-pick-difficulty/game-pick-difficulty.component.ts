import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { MultiplayerService } from '../game-multiplayer/services/multiplayer.service';
import { WebSocketService } from '../game-multiplayer/services/web-socket.service';
import { SocketEndpoints } from '../../shared/models/websocketEndpoints';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { GameConfig, GameConfigService } from '../game-config.service';
import { TranslationService } from '@/app/services/translation.service';
import { TranslatePipe } from '@/app/pipes/translation.pipe';
import { GAMESTATE } from '@/app/shared/models/interfaces';

@Component({
  selector: 'app-game-pick-difficulty',
  templateUrl: './game-pick-difficulty.component.html',
  styleUrl: './game-pick-difficulty.component.scss',
  standalone: true,
  imports: [NgIf, MatIcon, MatButton, TranslatePipe],
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
    private webSocketService: WebSocketService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
      this.gameConfigService.config$.subscribe((config: GameConfig) => {
        this.config = config;
      });
    } else {
      this.isMultiPlayer = true;
      this.multiplayerService.getLabel(false).subscribe((res: string) => {
        if (res) {
          this.multiplayerService.stateInfo = {
            ...this.multiplayerService.stateInfo,
            label: res,
            gameState: GAMESTATE.waitingForWord,
          };
        }
      });
      this.webSocketService.listen(SocketEndpoints.END_GAME).subscribe();
    }
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
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
