import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { MultiplayerService, GAMELEVEL } from '../game-multiplayer/services/multiplayer.service';
import { WebSocketService } from '../game-multiplayer/services/web-socket.service';
import { SocketEndpoints } from '../../shared/models/websocketEndpoints';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslationService } from '@/app/services/translation.service';
import { TranslatePipe } from '@/app/pipes/translation.pipe';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
  standalone: true,
  imports: [
    MatIcon, 
    MatButton,
    TranslatePipe
  ],
})
export class GameInfoComponent implements OnInit {
  @Output() getDifficultyPicker = new EventEmitter();
  isSinglePlayer = false;
  isMultiPlayer = false;

  constructor(
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
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
  }

  goToDifficultyPicker() {
    if (this.isSinglePlayer) {
      this.getDifficultyPicker.emit(true);
    } else {
      //How to set difficulty in multiplayer?
      this.multiplayerService.getLabel(true);
    }
  }

  goToLanding() {
    this.router.navigate([routes.LANDING]);
  }
}
