import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DrawingService } from '../drawing/services/drawing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  result: boolean;

  constructor(private drawingService: DrawingService, private router: Router) {}

  ngOnInit(): void {
    this.getResult();
  }

  getResult() {
    this.drawingService.resultSource.subscribe(
      (result) => ((this.result = result), console.log(result))
    );
  }

  newDrawing() {
    this.router.navigate(['/drawing']);
  }
}
