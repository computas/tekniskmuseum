import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DrawingService } from '../game-draw/services/drawing.service';

@Component({
  selector: 'app-game-word-to-draw',
  templateUrl: './game-word-to-draw.component.html',
  styleUrls: ['./game-word-to-draw.component.scss'],
})
export class GameWordToDrawComponent implements OnInit {
  constructor(private drawingService: DrawingService) {}
  @Output() drawWord = new EventEmitter();
  word = '';
  guessUsed = 1;
  gameHasStarted = false;
  loading = true;
  ngOnInit(): void {
    if (this.gameHasStarted) {
      this.drawingService.getLabel().subscribe((res) => {
        this.word = res.label;
        this.loading = false;
      });
      this.guessUsed = this.drawingService.guessUsed;
    } else {
      this.drawingService.startGame().subscribe((res) => {
        this.loading = false;
        this.word = this.drawingService.label;
        this.gameHasStarted = true;
      });
      this.guessUsed = this.drawingService.guessUsed;
    }
  }
}
