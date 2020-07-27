import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { StartGamePlayerId } from './start-game-player-id';
import { GameLabel } from './game-label';
import { Result } from '../../../shared/models/result.interface';
import { ResultsMock } from './results.mock';
import { endpoints } from '../../../shared/models/endpoints';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  baseUrl = endpoints.TEKNISKBACKEND;
  totalGuess = 3;
  playerid = '';
  labels = [];
  label = '';
  gameHasStarted = false;
  classificationDone = false;
  guess = '';

  private readonly _guessUsed = new BehaviorSubject<number>(1);
  private readonly _gameOver = new BehaviorSubject<boolean>(false);
  private readonly _guessDone = new BehaviorSubject<boolean>(false);
  private readonly _results = new BehaviorSubject<Result[]>([]);

  readonly guessUsed$ = this._guessUsed.asObservable();
  readonly results$ = this._results.asObservable();
  readonly guessDone$ = this._guessDone.asObservable();
  readonly gameOver$ = this._gameOver.asObservable();

  resultsMock: Result[] = ResultsMock;

  constructor(private http: HttpClient) {}

  classify(answerInfo: FormData): Observable<any> {
    return this.http.post<FormData>(`${this.baseUrl}/${endpoints.CLASSIFY}`, answerInfo).pipe(
      tap((res) => {
        if (this.roundIsDone(res)) {
          res.roundIsDone = true;
          const result: Result = this.createResult(res);
          this.addResult(result);
          this.guessDone = true;
          this.guessUsed++;
          this.classificationDone = true;
          const isDonePlaying = this.results.length === this.totalGuess;
          if (isDonePlaying) {
            this.gameOver = isDonePlaying;
          }
        }
      })
    );
  }

  createResult(res): Result {
    const result: Result = {
      hasWon: res.hasWon,
      imageData: '',
      word: this.label,
      gameState: res.gameState,
      guess: res.guess,
      score: res.score ? res.score : 0,
    };
    return result;
  }

  roundIsDone(res) {
    return res.hasWon || res.gameState === 'Done';
  }

  get() {
    return this.resultsMock;
  }

  startGame(): Observable<GameLabel> {
    return this.http.get<StartGamePlayerId>(`${this.baseUrl}/${endpoints.STARTGAME}`).pipe(
      switchMap((res) => {
        this.playerid = res.player_id;
        return this.getLabel();
      })
    );
  }

  getLabel(): Observable<GameLabel> {
    return this.http
      .post<GameLabel>(`${this.baseUrl}/${endpoints.GETLABEL}?player_id=${this.playerid}`, {})
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

  clearState() {
    this.guessUsed = 1;
    this.gameOver = false;
    this.guessDone = false;
    this.results = [];
  }

  get lastResult(): Result {
    return this.results[this.results.length - 1];
  }

  get guessUsed(): number {
    return this._guessUsed.getValue();
  }

  set guessUsed(val: number) {
    this._guessUsed.next(val);
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
