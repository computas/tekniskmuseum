import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../shared/models/routes';
import { MultiplayerService } from '../multiplayer/services/multiplayer.service';
import { DrawingService } from '../game/game-draw/services/drawing.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(
    private router: Router,
    private multiplayerService: MultiplayerService,
    private drawingService: DrawingService
  ) {}

  ngOnInit() {
    this.multiplayerService.clearState();
    this.drawingService.clearState();
  }

  goToGameModePage() {
    this.router.navigate([routes.GAMEMODE]);
  }
}
