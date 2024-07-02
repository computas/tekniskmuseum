import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

import { DrawingService } from './game-draw/services/drawing.service';
import { GameWordToDrawComponent } from './game-word-to-draw/game-word-to-draw.component';
import { GameResultComponent } from './game-result/game-result.component';
import { GameIntermediateResultComponent } from './game-intermediate-result/game-intermediate-result.component';
import { GameDrawComponent } from './game-draw/game-draw.component';
import { GameInfoComponent } from './game-info/game-info.component';
import { GamePickDifficultyComponent } from './game-pick-difficulty/game-pick-difficulty.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }),
        style({ right: '-100%', opacity: 0 }),
        animate('.4s ease-out', style({ right: '0%', opacity: 1 })),
      ]),
      transition(':leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }),
        animate('.4s ease-out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ]),
    ]),
  ],
  standalone: true,
  imports: [
    GameInfoComponent,
    GamePickDifficultyComponent,
    GameDrawComponent,
    GameIntermediateResultComponent,
    GameResultComponent,
    GameWordToDrawComponent,
  ],
})
export class GameComponent implements OnInit, OnDestroy {
  newGame = false;
  guessDone = false;
  showDifficultyPicker = false;
  showHowToPlay = true;
  showIntermediateResult = false;
  showFinalResult = false;
  showWordToDraw = false;

  constructor(private drawingService: DrawingService) {}

  ngOnDestroy(): void {
    this.clearGameState();
    this.drawingService.endGame();
  }
  ngOnInit(): void {
    this.drawingService.guessUsed = 1;
    this.drawingService.guessDone$.subscribe({
      next: (value) => {
        this.showIntermediateResult = value;
      },
    });
  }

  getDifficultyPicker() {
    this.showDifficultyPicker = true;
    this.showHowToPlay = false;
  }

  getDrawWord() {
    this.showWordToDraw = true;
    this.showDifficultyPicker = false;
  }

  startGame() {
    this.showWordToDraw = false;
    this.newGame = true;
  }

  nextGuess() {
    this.clearGameState();
    this.showWordToDraw = true;
  }

  finalResult() {
    this.clearGameState();
    this.showFinalResult = this.drawingService.gameOver;
  }

  clearGameState() {
    this.newGame = false;
    this.showIntermediateResult = false;
    this.showFinalResult = false;
    this.guessDone = false;
  }
}
