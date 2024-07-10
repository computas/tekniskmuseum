import { Component, OnInit } from '@angular/core';
import { ExampleDrawingService } from '../../services/example-drawing.service';

@Component({
  selector: 'app-game-example-drawings',
  standalone: true,
  imports: [],
  templateUrl: './game-example-drawings.component.html',
  styleUrl: './game-example-drawings.component.scss',
})
export class GameExampleDrawingsComponent implements OnInit {
  exampleDrawings: string[] = [];
  constructor(private exampleDrawingService: ExampleDrawingService) {}
  ngOnInit(): void {
    this.exampleDrawingService.getExampleDrawings(2, 'helicopter');
    for (let i = 0; i < 3; i++) {
      this.exampleDrawings.push('test' + i + '.jpg');
    }
  }
}
