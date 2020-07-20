import { Component, OnInit } from '@angular/core';
import { MultiplayerService } from './services/multiplayer.service';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss'],
})
export class MultiplayerComponent implements OnInit {
  constructor(private multiplayerService: MultiplayerService) {}

  ngOnInit(): void {}
}
