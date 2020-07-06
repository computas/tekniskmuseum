import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
})
export class GameInfoComponent implements OnInit {
  @Output() getDrawWord = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  startDrawing() {
    this.getDrawWord.emit(true);
  }
}
