import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SPEECH } from '../../shared/speech-text/text';
import { SpeechService } from 'src/app/services/speech.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
})
export class GameInfoComponent implements OnInit {
  @Output() getDrawWord = new EventEmitter();

  constructor(private speechService: SpeechService) {}

  ngOnInit(): void {}

  startDrawing() {
    this.getDrawWord.emit(true);
  }

  speakInfo() {
    this.speechService.speak(SPEECH.info);
  }
}
