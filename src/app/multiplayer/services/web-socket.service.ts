import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';

export interface GameOverData {
  game_over: boolean | undefined;
  player_left: string | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket: any;

  gameOverData: GameOverData;

  private readonly _gameOver = new BehaviorSubject<boolean>(false);
  readonly gameOver$ = this._gameOver.asObservable();

  constructor() {}

  startSockets() {
    console.log('setup');
    this.socket = io(environment.WS_ENDPOINT);

    this.socket.on('connect_failed', () => {
      console.log('Connection Failed');
    });
    this.socket.on('connect_error', (error) => {
      console.error(error);
    });

    this.socket.on('connect', () => {
      console.log('Connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('disconnected', reason);
    });

    this.listen('game_over').subscribe((data: any) => {
      const el: GameOverData = JSON.parse(data);
      if (el.game_over) {
        this.gameOver = true;
        this.disconnect();
      }
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  get gameOver(): boolean {
    return this._gameOver.getValue();
  }

  set gameOver(val: boolean) {
    this._gameOver.next(val);
  }
}
