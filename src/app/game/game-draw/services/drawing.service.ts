import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StartGameInfo } from './start-game-info';
import { Result } from '../../../shared/models/result.interface';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  baseUrl = 'https://tekniskback.azurewebsites.net';
  startGameInfo: StartGameInfo;
  totalGuess = 5;

  private readonly _gameOver = new BehaviorSubject<boolean>(false);
  private readonly _guessDone = new BehaviorSubject<boolean>(false);
  private readonly _results = new BehaviorSubject<Result[]>([]);

  readonly results$ = this._results.asObservable();
  readonly guessDone$ = this._guessDone.asObservable();
  readonly gameOver$ = this._gameOver.asObservable();

  constructor(private http: HttpClient) {}

  submitAnswer(answerInfo: FormData, imageData: string): Observable<any> {
    return this.http.post<FormData>(`${this.baseUrl}/submitAnswer`, answerInfo).pipe(
      tap((res) => {
        const result: Result = {
          hasWon: res.hasWon,
          imageData,
          word: this.startGameInfo.label,
        };
        this.addResult(result);
        this.guessDone = true;
        this.isGameOver();
      })
    );
  }

  isGameOver() {
    const isDonePlaying = this.results.length === this.totalGuess;
    if (isDonePlaying) {
      this.gameOver = isDonePlaying;
    }
  }

  startGame(): Observable<StartGameInfo> {
    return this.http.get<StartGameInfo>(`${this.baseUrl}/startGame`).pipe(
      tap((res) => {
        this.startGameInfo = res;
      })
    );
  }

  endGame() {
    this.guessDone = false;
    this.gameOver = false;
    this.results = [];
  }

  addResult(result: Result) {
    this.results = [...this.results, result];
  }

  get lastResult(): Result {
    return this.results[this.results.length - 1];
  }

  get results(): Result[] {
    return this._results.getValue();
  }

  set results(val: Result[]) {
    this._results.next(val);
  }

  get guessDone(): boolean {
    return this._guessDone.getValue();
  }

  set guessDone(val: boolean) {
    this._guessDone.next(val);
  }

  get gameOver(): boolean {
    return this._gameOver.getValue();
  }

  set gameOver(val: boolean) {
    this._gameOver.next(val);
  }
}
