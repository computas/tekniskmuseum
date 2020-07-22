import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DrawingService } from '../game-draw/services/drawing.service';
import { SPEECH } from 'src/app/shared/speech-text/text';
import { SpeechService } from 'src/app/services/speech.service';
import { Router } from '@angular/router';
import { routes } from 'src/app/shared/models/routes';

@Component({
  selector: 'app-game-word-to-draw',
  templateUrl: './game-word-to-draw.component.html',
  styleUrls: ['./game-word-to-draw.component.scss'],
})
export class GameWordToDrawComponent implements OnInit {
  constructor(private drawingService: DrawingService, private speechService: SpeechService, private router: Router) {}
  isSinglePlayer = false;
  isMultiPlayer = false;
  @Output() drawWord = new EventEmitter();
  word = '';
  guessUsed = 1;

  loading = true;
  ngOnInit(): void {
    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
    } else {
      this.isMultiPlayer = true;
    }
    if (this.isSinglePlayer) {
      if (this.drawingService.gameHasStarted) {
        this.drawingService.getLabel().subscribe((res) => {
          this.word = res.label;
          this.loading = false;
        });
        this.drawingService.guessUsed$.subscribe((res) => {
          this.guessUsed = res;
        });
      } else {
        this.drawingService.startGame().subscribe((res) => {
          this.loading = false;
          this.word = this.drawingService.label;
          this.drawingService.gameHasStarted = true;
        });
        this.drawingService.guessUsed$.subscribe((res) => {
          this.guessUsed = res;
        });
      }
    }
    if (this.isMultiPlayer) {
    }
  }

  speakWord() {
    this.speechService.speak(`${SPEECH.draw}${this.word}`);
  }
}
