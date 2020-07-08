import { Component, OnInit, OnDestroy } from '@angular/core';
import { DrawingService } from './game-draw/services/drawing.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  newGame = false;
  guessDone = false;
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
    this.drawingService.totalGuess = 3;
    this.drawingService.guessUsed = 1;
    this.drawingService.gameOver$.subscribe((gameOver) => {
      this.clearGameState();
      this.showFinalResult = gameOver;
    });
    this.drawingService.guessDone$.subscribe({
      next: (value) => {
        this.showIntermediateResult = value;
      },
    });
  }

  getDrawWord() {
    this.showWordToDraw = true;
    this.showHowToPlay = false;
  }

  startGame() {
    this.showHowToPlay = false;
    this.showWordToDraw = false;
    this.newGame = true;
  }

  nextGuess(event) {
    this.clearGameState();
    this.showWordToDraw = true;
  }

  clearGameState() {
    this.newGame = false;
    this.showIntermediateResult = false;
    this.showFinalResult = false;
    this.guessDone = false;
  }
}
