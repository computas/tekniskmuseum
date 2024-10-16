import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, EMPTY, throwError } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import {
  StartGamePlayerId,
  GameLabel,
  HighscoreData,
  PredictionData,
  Score,
} from '@/app/shared/models/backend-interfaces';
import { Certainty, Result } from '@/app/shared/models/interfaces';
import { ResultsMock } from '@/app/shared/mocks/results.mock';
import { endpoints } from '@/app/shared/models/endpoints';
import { TranslationService } from '@/app/core/translation.service';
import { GameConfigService } from './game-config.service';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  baseUrl = endpoints.TEKNISKBACKEND;

  config = this.gameConfigService.getConfig;

  playerid = '';
  label = '';
  gameHasStarted = false;
  classificationDone = false;
  guess = '';
  secondsUsedOnLastRound = 0;
  sortedCertainty: Certainty[] = [];

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
  pred: PredictionData | undefined;

  constructor(
    private http: HttpClient,
    private translationService: TranslationService,
    private gameConfigService: GameConfigService,
    private loggingService: LoggingService
  ) {
    this.gameConfigService.difficultyLevel$.subscribe((updatedConfig) => {
      this.config = updatedConfig;
    });
  }

  classify(answerInfo: FormData): Observable<PredictionData> {
    const currentLang = this.translationService.getCurrentLang();
    return this.http.post<PredictionData>(`${this.baseUrl}/${endpoints.CLASSIFY}?lang=${currentLang}`, answerInfo).pipe(
      tap((data: PredictionData) => {
        this.pred = data;
        if (
          this.guessUsed <= data.serverRound &&
          this.roundIsDone(data.hasWon, data.gameState) &&
          !this.hasAddedSingleplayerResult
        ) {
          const result: Result = this.createResult(data);
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
      serverRound: 1,
      roundIsDone: true,
    };
    return result;
  }

  createResult(res: PredictionData): Result {
    const result: Result = {
      hasWon: res.hasWon,
      imageData: '',
      word: this.label,
      gameState: res.gameState,
      guess: res.guess,
      score: 0,
      serverRound: res.serverRound,
      roundIsDone: this.roundIsDone(res.hasWon, res.gameState),
    };
    return result;
  }

  roundIsDone(hasWon: boolean, gameState: string) {
    return hasWon || gameState === 'Done';
  }

  get() {
    return this.resultsMock;
  }

  startGame(): Observable<GameLabel> {
    const headers = new HttpHeaders();
    headers.set('Access-Control-Allow-Origin', '*');
    return this.http
      .get<StartGamePlayerId>(`${this.baseUrl}/${endpoints.STARTGAME}?difficulty_id=${this.config.difficultyId}`, {
        headers: headers,
      })
      .pipe(
        switchMap((res) => {
          this.playerid = res.player_id;
          return this.getLabel();
        }),
        catchError((error) => {
          this.loggingService.error("Error occurred in endpoind /startgame: " + error.message);
          return throwError(() => new Error("Error occurred in /startgame"));
        }),
      );
  }

  getLabel(): Observable<GameLabel> {
    const currentLang = this.translationService.getCurrentLang();
    return this.http
      .post<GameLabel>(`${this.baseUrl}/${endpoints.GETLABEL}?player_id=${this.playerid}&lang=${currentLang}`, {})
      .pipe(
        tap((res) => (this.label = res.label)),
        catchError((error) => {
          this.loggingService.error("Error occurred in endpoind /getlabel: " + error.message);
          return throwError(() => new Error("Error occurred in /getlabel"));
        }),  
    );
  }
  
  getHighscore(): Observable<HighscoreData> {
    const difficultyId = this.config.difficultyId;
    const headers = new HttpHeaders();
    headers.set('Access-Control-Allow-Origin', '*');
    return this.http.get<HighscoreData>(`${this.baseUrl}/${endpoints.HIGHSCORE}?difficulty_id=${difficultyId}`, {
      headers: headers,
    });
  }

  endGame() {
    this.guessDone = false;
    this.gameOver = false;
    this.results = [];
  }

  postScore() {
    const difficultyId = this.config.difficultyId;
    const body: Score = {
      player_id: this.playerid,
      score: this.totalScore.toString(),
      difficulty_id: difficultyId,
    };
    const headers = new HttpHeaders();
    headers.set('Access-Control-Allow-Origin', '*');
    return this.http.post(`${this.baseUrl}/${endpoints.POSTSCORE}`, body, { headers: headers })
      .pipe(
        catchError((error) => {
          this.loggingService.error("Error occurred in endpoind /postscore: " + error.message);
          return EMPTY;
        }),
      )
    ;
  }

  addResult(result: Result) {
    this.results = [...this.results, result];
  }

  clearState() {
    this.gameHasStarted = false;
    this.guessUsed = 1;
    this.gameOver = false;
    this.guessDone = false;
    this.hasAddedSingleplayerResult = false;
    this.results = [];
  }

  get totalScore(): number {
    return this.results.map((res) => res.score).reduce((sum, current) => sum + current, 0);
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

  resetSecondsUsed() {
    this.setSecondsUsed(0);
  }

  getSecondsUsed(): number {
    return this.secondsUsedOnLastRound;
  }

  setSecondsUsed(time: number) {
    this.secondsUsedOnLastRound = time;
  }
}
