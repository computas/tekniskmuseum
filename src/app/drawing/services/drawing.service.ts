import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { catchError, retry } from 'rxjs/operators';
import { StartGameInfo } from './start-game-info';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  baseUrl = 'https://tekniskback.azurewebsites.net';
  constructor(private http: HttpClient) {}

  submitAnswer(answerInfo: FormData): Observable<any> {
    return this.http.post<FormData>(`${this.baseUrl}/submitAnswer`, answerInfo);
  }

  startGame(): Observable<StartGameInfo> {
    return this.http.get<StartGameInfo>(`${this.baseUrl}/startGame`);
  }
}
