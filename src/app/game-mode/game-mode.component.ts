import { Component, OnInit } from '@angular/core';
import { routes } from '../shared/models/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-mode',
  templateUrl: './game-mode.component.html',
  styleUrls: ['./game-mode.component.scss'],
})
export class GameModeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToSingleplayer() {
    this.router.navigate([routes.SINGLEPLAYER]);
  }

  goToMultiplayer() {
    this.router.navigate([routes.MULTIPLAYER]);
  }

  goToLanding() {
    this.router.navigate([routes.LANDING]);
  }
}
