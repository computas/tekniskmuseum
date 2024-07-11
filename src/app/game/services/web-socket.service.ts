import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '@/environments/environment';
import { SocketEndpoints } from '@/app/shared/models/websocketEndpoints';
import { PlayerDisconnectedData } from '@/app/shared/models/interfaces';
import { GameStateService } from '../services/game-state-service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket: Socket | undefined;

  playerDisconnectedData: PlayerDisconnectedData | undefined;

  private readonly _playerDisconnected = new BehaviorSubject<boolean>(false);
  readonly playerDisconnected$ = this._playerDisconnected.asObservable();

  constructor(private gameStateService: GameStateService) {}

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

    this.listen(SocketEndpoints.PLAYER_DISCONNECTED).subscribe((data: string) => {
      const el: PlayerDisconnectedData = JSON.parse(data);
      if (el.player_disconnected && !this.gameStateService.isGameOver()) {
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

  listen<T = string>(eventName: string) {
    return new Observable<T>((subscriber) => {
      this.socket?.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  // Disable any type check for only this one because the spread parameter will take parameters of different types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(eventName: string, ...rest: any) {
    this.socket?.emit(eventName, ...rest);
  }

  get playerDisconnected(): boolean {
    return this._playerDisconnected.getValue();
  }

  set playerDisconnected(val: boolean) {
    this._playerDisconnected.next(val);
  }
}
