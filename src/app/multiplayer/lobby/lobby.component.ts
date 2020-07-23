import { Component, OnInit } from '@angular/core';
import { MultiplayerService } from '../services/multiplayer.service';
import { routes } from '../../shared/models/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
  waitingForOtherPlayer = true;

  constructor(public multiPlayerService: MultiplayerService, private router: Router) {}

  ngOnInit(): void {
    this.multiPlayerService.joinGame();
    this.multiPlayerService.stateInfo$.subscribe((obs) => {
      if (obs.ready) {
        this.waitingForOtherPlayer = false;
      }
    });
  }

  goToGameInfo() {
    this.router.navigate([routes.MULTIPLAYER]);
  }
}
