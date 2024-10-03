import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Router } from '@angular/router';
import { environment } from '@/environments/environment';
import { SocketEndpoints } from '@/app/shared/models/websocketEndpoints';
import { PlayerDisconnectedData } from '@/app/shared/models/interfaces';
import { GameStateService } from '../services/game-state-service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket: Socket | undefined;
  private retryAttempts = 0;
  private maxRetries = 2;
  private retryDelay = 3000;

  playerDisconnectedData: PlayerDisconnectedData | undefined;

  private readonly _playerDisconnected = new BehaviorSubject<boolean>(false);
  readonly playerDisconnected$ = this._playerDisconnected.asObservable();
  private isConnected = false;
  private isRetrying = false;


  constructor(private gameStateService: GameStateService, private router: Router) {}

  startSockets() {
    if (this.socket && this.socket.connected) {
      console.warn('Socket already connected');
      return;
    } 

    if (this.isRetrying) {
      console.warn('Currently retrying connection; will not start a new connection.');
      return;
    }

    this.isRetrying = true;
    this.socket = io(environment.TEKNISKBACKEND_ENDPOINT);

    this.socket.on('connect', () => {
      this.isConnected = true;
    })

    this.socket.on('connect_failed', () => {
      console.error('connect_failed');
      this.handleConnectionError();

    });

    this.socket.on('connect_error', (error) => {
      console.error(error);
      this.handleConnectionError();
    });

    // Disable any type check for only this one because the spread parameter will take parameters of different types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.socket.on('disconnect', (reason: any) => {
      console.warn('disconnected', reason);
      this.isConnected = false;
      if (reason !== "io client disconnect") {
        this.handleConnectionError();
      }
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
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = undefined;
      this.isConnected = false;
      this.isRetrying = false;
      this.retryAttempts = 0;
      console.log("Websocket closed properly");
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

  handleConnectionError() {
    this.retryAttempts++;

    if (this.retryAttempts <= this.maxRetries) {
      console.warn(`Retrying connection... Attempt ${this.retryAttempts}/${this.maxRetries}`);
      setTimeout(() => {
        this.startSockets();
      }, this.retryDelay);
    } else {
      console.error('Max retry attempts reached. Redirecting to welcome page.');
      this.redirectToWelcomePage();
    }
  }

  redirectToWelcomePage() {
    this.disconnect();
    this.router.navigate(['/welcome'])
  }
}

