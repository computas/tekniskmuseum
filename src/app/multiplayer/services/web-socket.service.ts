import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket: any;

  constructor() {
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
}
