import { Component, OnInit } from '@angular/core';
import { SpeechService } from '../services/speech.service';
import { SPEECH } from '../shared/speech-text/text';

@Component({
  selector: 'app-game-mode',
  templateUrl: './game-mode.component.html',
  styleUrls: ['./game-mode.component.scss'],
})
export class GameModeComponent implements OnInit {
  constructor(private speechService: SpeechService) {}

  ngOnInit(): void {}

  speakGameMode() {
    this.speechService.speak(SPEECH.gameMode);
  }
}
