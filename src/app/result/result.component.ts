import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DrawingService } from '../drawing/services/drawing.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Result } from '../shared/models/result.interface';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  result$: Observable<Result>;

  constructor(private drawingService: DrawingService, private router: Router) {}

  ngOnInit(): void {
    this.result$ = this.drawingService.resultSource.pipe(
      tap((x) => console.log(x, 'result log'))
    );
  }

  newDrawing() {
    this.router.navigate(['/drawing']);
  }
}
