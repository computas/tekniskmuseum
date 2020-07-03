import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  newGame = false;
  startNewGame: boolean;
  constructor() {}

  testStartGame(event) {
    console.log('startEvent');
    this.newGame = event;
  }
  ngOnInit(): void {
    console.log(this.newGame);
  }
}
