import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { catchError, retry } from 'rxjs/operators';
import { StartGameInfo } from './start-game-info';
import { Result } from '../../shared/models/result.interface';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  baseUrl = 'https://tekniskback.azurewebsites.net';
  resultSource = new Subject<Result>();

  constructor(private http: HttpClient) {}

  submitAnswer(answerInfo: FormData, imageData: string): Observable<any> {
    return this.http
      .post<FormData>(`${this.baseUrl}/submitAnswer`, answerInfo)
      .pipe(tap((res) => this.updateResult(res.hasWon, imageData)));
  }

  startGame(): Observable<StartGameInfo> {
    return this.http.get<StartGameInfo>(`${this.baseUrl}/startGame`);
  }

  updateResult(result: boolean, imageData: string) {
    console.log(1);
    this.resultSource.next({
      hasWon: result,
      imageData: imageData,
    });
  }
}
