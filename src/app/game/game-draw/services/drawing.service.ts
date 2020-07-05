import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StartGameInfo } from './start-game-info';
import { Result } from '../../../shared/models/result.interface';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  baseUrl = 'https://tekniskback.azurewebsites.net';
  resultSource = new Subject<Result>();
<<<<<<< HEAD
=======
  startGameInfo: StartGameInfo;
  totalGuess = 5;
  words: string[] = [];
  results: object[] = [];
  gameOver = new BehaviorSubject<boolean>(false);
  guessDone = new BehaviorSubject<boolean>(false);
>>>>>>> 1abd219... add: showWordToDraw component

  constructor(private http: HttpClient) {}

  submitAnswer(answerInfo: FormData, imageData: string): Observable<any> {
    return this.http
      .post<FormData>(`${this.baseUrl}/submitAnswer`, answerInfo)
      .pipe(tap((res) => this.updateResult(res.hasWon, imageData)));
  }

  startGame(): Observable<StartGameInfo> {
    return this.http.get<StartGameInfo>(`${this.baseUrl}/startGame`).pipe(
      tap((res) => {
        this.words.push(res.label);
        this.startGameInfo = res;
      })
    );
  }

  updateResult(result: boolean, imageData: string) {
<<<<<<< HEAD
    this.resultSource.next({
      hasWon: result,
      imageData,
    });
=======
    const gameResult = { hasWon: result, imageData };
    this.results.push(gameResult);
    this.resultSource.next(gameResult);

    const isDonePlaying = this.results.length === this.totalGuess;
    if (isDonePlaying) {
      this.gameOver.next(isDonePlaying);
    }
>>>>>>> 1abd219... add: showWordToDraw component
  }
}
