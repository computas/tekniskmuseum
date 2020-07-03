import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../game/game-draw/services/drawing.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Result } from '../shared/models/result.interface';
import { routes } from '../shared/models/routes';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  result$: Observable<Result>;

  constructor(private drawingService: DrawingService, private router: Router) {}

  ngOnInit(): void {
    this.result$ = this.drawingService.resultSource;
  }

  newDrawing() {
    this.router.navigate([`/${routes.DRAWING}`]);
  }
}
