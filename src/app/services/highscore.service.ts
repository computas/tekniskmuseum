import { Injectable } from '@angular/core';
import { of } from 'rxjs';

export interface Highscore {
  name: string;
  score: number;
}
@Injectable({
  providedIn: 'root',
})
export class HighscoreService {
  highscores: Highscore[] = [
    { name: 'gunnar', score: 10 },
    { name: 'Patricia Harrison', score: 23 },
    { name: 'Koa Ahmad', score: 17 },
    { name: 'Beck Mcgregor', score: 13 },
    { name: 'Matteo Atherton', score: 11 },
    { name: 'Kaelan Wheeler', score: 26 },
    { name: 'Amie Sargent', score: 5 },
    { name: 'Brook Trujillo', score: 3 },
    { name: 'Jevon Rocha', score: 14 },
    { name: 'Amie Sargent', score: 10 },
  ];

  constructor() {}

  get() {
    return of(this.highscores);
  }
}
