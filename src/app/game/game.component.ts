import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition, query, animateChild, group } from '@angular/animations';

import { DrawingService } from './game-draw/services/drawing.service';
import { routeTransitionAnimations } from '../route-transition-animations';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }),
        style({ right: '-100%', opacity: 0 }),
        animate('.4s ease-out', style({ right: '0%', opacity: 1 }))
      ]),
      transition(':leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }),
        animate('.4s ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class GameComponent implements OnInit, OnDestroy {
  newGame = false;
  guessDone = false;
  showHowToPlay = true;
  showIntermediateResult = false;
  showFinalResult = false;
  showWordToDraw = false;

  constructor(private drawingService: DrawingService) { }

  ngOnDestroy(): void {
    this.clearGameState();
    this.drawingService.endGame();
  }
  ngOnInit(): void {
    this.drawingService.totalGuess = 3;
    this.drawingService.guessUsed = 1;
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

  finalResult(event) {
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
