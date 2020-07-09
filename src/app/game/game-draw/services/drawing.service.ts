import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { StartGameToken } from './start-game-token';
import { GameLabel } from './game-label';
import { Result } from '../../../shared/models/result.interface';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  baseUrl = 'https://tekniskback.azurewebsites.net';
  totalGuess = 3;
  token = '';
  labels = [];
  label = '';

  private readonly _gameOver = new BehaviorSubject<boolean>(false);
  private readonly _guessDone = new BehaviorSubject<boolean>(false);
  private readonly _results = new BehaviorSubject<Result[]>([]);

  readonly results$ = this._results.asObservable();
  readonly guessDone$ = this._guessDone.asObservable();
  readonly gameOver$ = this._gameOver.asObservable();

  constructor(private http: HttpClient) {}

  classify(answerInfo: FormData, imageData: string): Observable<any> {
    return this.http.post<FormData>(`${this.baseUrl}/classify`, answerInfo).pipe(
      tap((res) => {
        const result: Result = {
          hasWon: res.hasWon,
          imageData,
          word: this.label,
          gameState: res.gameState,
        };
        if (result.gameState == 'Playing' && result.hasWon == true) {
          this.addResult(result);
          this.guessDone = true;
          this.isGameOver();
        } else if (result.gameState == 'Done') {
          this.addResult(result);
          this.guessDone = true;
          this.isGameOver();
        }
      })
    );
  }

  isGameOver() {
    const isDonePlaying = this.results.length === this.totalGuess;
    if (isDonePlaying) {
      this.gameOver = isDonePlaying;
    }
  }

  startGame(): Observable<GameLabel> {
    return this.http.get<StartGameToken>(`${this.baseUrl}/startGame`).pipe(
      switchMap((res) => {
        this.token = res.token;
        return this.getLabel();
      })
    );
  }

  getLabel(): Observable<GameLabel> {
    const options = {};
    return this.http
      .post<GameLabel>(`${this.baseUrl}/getLabel?token=${this.token}`, {})
      .pipe(tap((res) => (this.label = res.label)));
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
