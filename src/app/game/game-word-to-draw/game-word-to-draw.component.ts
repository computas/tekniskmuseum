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
  loading = true;
  ngOnInit(): void {
    this.drawingService.startGame().subscribe((res) => {
      this.loading = false;
      this.word = res.label;
    });
  }
}
