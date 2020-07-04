import { Component, OnInit } from '@angular/core';
import { DrawingService } from './game-draw/services/drawing.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  newGame = false;
  guessDone = false;
  showIntermediateResult = false;
  constructor(private drawingService: DrawingService) {}

  StartGame(event) {
    this.newGame = event;
  }
  ngOnInit(): void {
    this.drawingService.guessDone.subscribe({
      next: (value) => {
        this.showIntermediateResult = value;
      },
    });
  }
  nextGuess(event) {
    this.newGame = true;
    this.showIntermediateResult = false;
  }
}
