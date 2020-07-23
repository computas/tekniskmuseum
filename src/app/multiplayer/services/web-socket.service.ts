import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';

export interface PlayerDisconnectedData {
  player_disconnected: boolean | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket: SocketIOClient.Socket;

  playerDisconnectedData: PlayerDisconnectedData;

  private readonly _playerDisconnected = new BehaviorSubject<boolean>(false);
  readonly playerDisconnected$ = this._playerDisconnected.asObservable();

  constructor() {}

  startSockets() {
    this.socket = io(environment.WS_ENDPOINT);

    this.socket.on('connect_failed', () => {
      console.error('connect_failed');
    });

    this.socket.on('connect_error', (error) => {
      console.error(error);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('disconnected', reason);
    });
    this.socket.on('error', (reason) => {
      console.error('error', reason);
    });

    this.listen('player_disconnected').subscribe((data: any) => {
      const el: PlayerDisconnectedData = JSON.parse(data);
      if (el.player_disconnected) {
        this.playerDisconnected = true;
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

  emit(eventName: string, ...rest: any) {
    this.socket.emit(eventName, ...rest);
  }

  get playerDisconnected(): boolean {
    return this._playerDisconnected.getValue();
  }

  set playerDisconnected(val: boolean) {
    this._playerDisconnected.next(val);
  }
}
