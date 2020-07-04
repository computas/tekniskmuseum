import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StartGameInfo } from './start-game-info';
import { Result } from '../../../shared/models/result.interface';
import { routes } from '../../../shared/models/routes';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  baseUrl = routes.TEKNISKBACKEND;
  resultSource = new Subject<Result>();
  totalGuess = 5;
  words: string[];
  results: object[] = [];
  gameOver = new BehaviorSubject<boolean>(false);
  guessDone = new BehaviorSubject<boolean>(false);

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
    const isDonePlaying = this.results.length === this.totalGuess;
    if (isDonePlaying) {
      this.gameOver.next(isDonePlaying);
    } else {
      const gameResult = { hasWon: result, imageData };
      this.results.push(gameResult);
      this.resultSource.next(gameResult);
    }
  }
}
