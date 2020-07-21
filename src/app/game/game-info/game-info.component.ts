import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { SPEECH } from '../../shared/speech-text/text';
import { SpeechService } from 'src/app/services/speech.service';
import { MultiplayerService, GAMELEVEL } from 'src/app/multiplayer/services/multiplayer.service';

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
    private multiplayerService: MultiplayerService
  ) {}

  ngOnInit(): void {
    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
    } else {
      this.isMultiPlayer = true;
    }
  }

  startDrawing() {
    if (this.isSinglePlayer) {
      this.getDrawWord.emit(true);
    } else {
      this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, gameLevel: GAMELEVEL.waitingForWord };
    }
  }

  goToLanding() {
    this.router.navigate([routes.LANDING]);
  }

  speakInfo() {
    this.speechService.speak(SPEECH.info);
  }
}
