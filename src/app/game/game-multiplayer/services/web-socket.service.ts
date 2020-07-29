import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { SocketEndpoints } from '../../../shared/models/websocketEndpoints';

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

    this.listen(SocketEndpoints.PLAYER_DISCONNECTED).subscribe((data: any) => {
      const el: PlayerDisconnectedData = JSON.parse(data);
      if (el.player_disconnected) {
        this.playerDisconnected = true;
        this.disconnect();
      }
    });
  }

  disconnect() {
    if (this.socket && !this.socket.disconnected) {
      console.warn('socket disconnecting and removing listener');
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
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
