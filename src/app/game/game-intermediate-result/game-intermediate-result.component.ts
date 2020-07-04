import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../../shared/models/result.interface';
import { DrawingService } from '../game-draw/services/drawing.service';
@Component({
  selector: 'app-game-intermediate-result',
  templateUrl: './game-intermediate-result.component.html',
  styleUrls: ['./game-intermediate-result.component.scss'],
})
export class GameIntermediateResultComponent implements OnInit {
  result$: Observable<Result>;
  @Output() nextGuess = new EventEmitter();

  constructor(private drawingService: DrawingService) {}

  ngOnInit(): void {
    this.result$ = this.drawingService.resultSource;
  }

  newDrawing() {
    this.nextGuess.next(true);
  }
}
