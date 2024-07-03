import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Result, StartGamePlayerId, GameLabel, Highscore } from '../../../shared/models/interfaces';
import { ResultsMock } from '../../../shared/mocks/results.mock';
import { endpoints } from '../../../shared/models/endpoints';
import { GameConfigService } from '../../game-config.service';

@Injectable({
  providedIn: 'root',
})

export class DrawingService {
  baseUrl = endpoints.TEKNISKBACKEND;
  
  config = this.gameConfigService.getConfig; 
  
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
  
  hasAddedSingleplayerResult = false;
  pred: any;
  
  constructor(
    private http: HttpClient,
    private gameConfigService: GameConfigService
  ) {
    this.gameConfigService.difficultyLevel$.subscribe(updatedConfig => {
      this.config = updatedConfig 
    });
  }

  classify(answerInfo: FormData): Observable<any> { 
    return this.http.post<FormData>(`${this.baseUrl}/${endpoints.CLASSIFY}`, answerInfo).pipe(
      tap((res: any) => {
        this.pred = res;
        if (this.guessUsed <= res.serverRound && this.roundIsDone(res) && !this.hasAddedSingleplayerResult) {
          res.roundIsDone = true;
          const result: Result = this.createResult(res);
          this.addResult(result);
          this.updateGameState();
        }
      })
    );
  }
  updateGameState() {
    this.hasAddedSingleplayerResult = true;
    this.guessDone = true;
    this.guessUsed++;
    this.classificationDone = true;
    const isDonePlaying = this.results.length === this.config.rounds; 
    if (isDonePlaying) {
      this.gameOver = isDonePlaying;
    }
  }
  createDefaultResult() {
    const result: Result = {
      hasWon: false,
      imageData:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAQAAAD2e2DtAAABm0lEQVR42u3SMQEAAAgDINc/9LxMIWQg7fBYBBAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARBAAAEEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEQAAEEEAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARCAs6Mk/xDKKakhAAAAAElFTkSuQmCC',
      word: this.label,
      gameState: 'Done',
      guess: '',
      score: 0,
    };
    return result;
  }

  createResult(res: any): Result {
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

  roundIsDone(res: any) {
    return res.hasWon || res.gameState === 'Done';
  }

  get() {
    return this.resultsMock;
  }

  startGame(): Observable<GameLabel> {
    const headers = new HttpHeaders();
    headers.set('Access-Control-Allow-Origin', '*');
    return this.http.get<StartGamePlayerId>(`${this.baseUrl}/${endpoints.STARTGAME}?difficulty_id=${this.config.difficultyId}`, { headers: headers }).pipe(
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

  getHighscore(): Observable<Highscore>{
    const headers = new HttpHeaders();
    headers.set('Access-Control-Allow-Origin', '*');
    return this.http
    .get<Highscore>(`${this.baseUrl}/${endpoints.HIGHSCORE}`, { headers: headers })
  }

  endGame() {
    this.guessDone = false;
    this.gameOver = false;
    this.results = [];
  }

  postScore() {
    const body = {
      player_id: this.playerid,
      score: this.totalScore.toString()
    }
    return this.http.post(`${this.baseUrl}/${endpoints.POSTSCORE}`, body);
  }

  addResult(result: Result) {
    this.results = [...this.results, result];
  }

  clearState() {
    this.gameHasStarted = false;
    this.guessUsed = 1;
    this.gameOver = false;
    this.guessDone = false;
    this.results = [];
  }

  get totalScore(): number {
    return this.results.map(res => res.score).reduce((sum, current) => sum+current, 0)
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
