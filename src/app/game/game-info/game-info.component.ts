import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { MultiplayerService } from '../services/multiplayer.service';
import { WebSocketService } from '../services/web-socket.service';
import { SocketEndpoints } from '../../shared/models/websocketEndpoints';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslationService } from '@/app/core/translation.service';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { GAMESTATE } from '@/app/shared/models/interfaces';
import { GameStateService } from '../services/game-state-service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
  standalone: true,
  imports: [MatIcon, MatButton, TranslatePipe],
})
export class GameInfoComponent implements OnInit {
  isSinglePlayer = false;
  isMultiPlayer = false;

  constructor(
    private router: Router,
    private multiplayerService: MultiplayerService,
    private webSocketService: WebSocketService,
    private translationService: TranslationService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.gameStateService.savePageToLocalStorage(GAMESTATE.howToPlay);
    this.translationService.lang$.subscribe((lang) => {
      this.translationService.loadTranslations(lang).subscribe(() => {
        this.translationService.setLanguage(lang);
      });
    });

    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
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
  }

  goToDifficultyPicker() {
    if (this.isSinglePlayer) {
      this.gameStateService.goToPage(GAMESTATE.difficultyPicker);
    } else {
      //How to set difficulty in multiplayer?
      this.multiplayerService.getLabel(true);
    }
  }

  goToLanding() {
    this.router.navigate([routes.LANDING]);
  }
}
