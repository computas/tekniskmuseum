import { Component, OnInit } from '@angular/core';
import { MultiplayerService, GAMELEVEL } from './services/multiplayer.service';
@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss'],
})
export class MultiplayerComponent implements OnInit {
  gameLevel: string | undefined;
  GAMELEVEL = GAMELEVEL;
  constructor(private multiplayerService: MultiplayerService) {}

  ngOnInit(): void {
    this.gameLevel = this.multiplayerService.stateInfo.gameLevel;
    console.log(this.multiplayerService.stateInfo);
  }
}
