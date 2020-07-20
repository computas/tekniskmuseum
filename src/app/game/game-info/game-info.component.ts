import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { SPEECH } from '../../shared/speech-text/text';
import { SpeechService } from 'src/app/services/speech.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
})
export class GameInfoComponent implements OnInit {
  @Output() getDrawWord = new EventEmitter();
  isSinglePlayer = false;

  constructor(private speechService: SpeechService, private router: Router) {}

  ngOnInit(): void {
    if (this.router.url === routes.SINGLEPLAYER) {
      this.isSinglePlayer = true;
    }
  }

  startDrawing() {
    this.getDrawWord.emit(true);
  }

  goToLanding() {
    this.router.navigate([routes.LANDING]);
  }

  speakInfo() {
    this.speechService.speak(SPEECH.info);
  }
}
