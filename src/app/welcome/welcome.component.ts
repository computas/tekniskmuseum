import { Component, OnInit } from '@angular/core';
import { MultiplayerService } from '../multiplayer/services/multiplayer.service';
import { DrawingService } from '../game/game-draw/services/drawing.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(private multiplayerService: MultiplayerService, private drawingService: DrawingService) {}

  ngOnInit() {
    this.multiplayerService.clearState();
    this.drawingService.clearState();
  }
}
