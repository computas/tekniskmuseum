import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { SPEECH } from '../../shared/speech-text/text';
import { SpeechService } from 'src/app/services/speech.service';
import { MultiplayerService, GAMELEVEL } from 'src/app/multiplayer/services/multiplayer.service';
import { WebSocketService } from 'src/app/multiplayer/services/web-socket.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
})
export class GameInfoComponent implements OnInit {
  @Output() getDrawWord = new EventEmitter();
  isSinglePlayer = false;
  isMultiPlayer = false;

  constructor(
    private speechService: SpeechService,
    private router: Router,
    private multiplayerService: MultiplayerService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
    } else {
      this.isMultiPlayer = true;
      this.multiplayerService.getLabel(false).subscribe((res) => {
        if (res) {
          this.multiplayerService.stateInfo = {
            ...this.multiplayerService.stateInfo,
            gameLevel: GAMELEVEL.waitingForWord,
          };
        }
      });
    }
    this.webSocketService.listen('endGame').subscribe((res) => {
      console.log(res);
    });
  }

  startDrawing() {
    if (this.isSinglePlayer) {
      this.getDrawWord.emit(true);
    } else {
      this.multiplayerService.getLabel(true);
    }
  }

  endGame() {
    this.multiplayerService.endGame();
  }

  goToLanding() {
    this.router.navigate([routes.LANDING]);
  }

  speakInfo() {
    this.speechService.speak(SPEECH.info);
  }
}
