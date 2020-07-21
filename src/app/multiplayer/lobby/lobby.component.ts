import { Component, OnInit } from '@angular/core';
import { MultiplayerService } from '../services/multiplayer.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
  constructor(public multiPlayerService: MultiplayerService) {}

  ngOnInit(): void {
    this.multiPlayerService.joinGame();
  }
}
