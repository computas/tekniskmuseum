import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { tap, catchError } from 'rxjs/operators';
import { Subject, EMPTY } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  WS_ENDPOINT = environment.WS_ENDPOINT;
  private socket$: WebSocketSubject<any>;

  private messagesSubject$ = new Subject();
  constructor() {}

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(
        tap({
          error: (error) => console.error(error),
        }),
        catchError((_) => EMPTY)
      );
      this.messagesSubject$.next(messages);
    }
  }

  private getNewWebSocket() {
    return webSocket(this.WS_ENDPOINT);
  }

  sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  close() {
    this.socket$.complete();
  }
}
