import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../../game-draw/services/drawing.service';

@Component({
  selector: 'app-game-progress-bar',
  standalone: true,
  imports: [],
  templateUrl: './game-progress-bar.component.html',
  styleUrl: './game-progress-bar.component.scss'
})
export class GameProgressBarComponent implements OnInit {
  roundProgressText: string = ''

  constructor(private drawingService: DrawingService){}
  
  ngOnInit(): void {

  }

  getRoundProgressText(): string {
    
    return ''
  }
}
