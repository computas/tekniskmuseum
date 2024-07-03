import { Component, ElementRef, OnInit, Output, EventEmitter, OnDestroy, viewChild } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { ImageService } from '../services/image.service';
import { take } from 'rxjs/operators';
import { DrawingService } from '../services/drawing.service';
import { MultiplayerService } from '../services/multiplayer.service';
import { Certainty, GAMESTATE, Result } from '../../shared/models/interfaces';
import { PredictionData } from '../../shared/models/backend-interfaces';
import { SoundService } from '../services/sound.service';
import { UpperCasePipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { GameLevelConfig, GameConfigService } from '../services/game-config.service';
import { TranslationService } from '@/app/core/translation.service';
import { TranslatePipe } from '@/app/core/translation.pipe';

@Component({
  selector: 'app-drawing',
  templateUrl: './game-draw.component.html',
  styleUrls: ['./game-draw.component.scss'],
  standalone: true,
  imports: [MatIcon, MatIconButton, UpperCasePipe, TranslatePipe],
})
export class GameDrawComponent implements OnInit, OnDestroy {
  config!: GameLevelConfig;
  subscriptions = new Subscription();

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  countDown = viewChild.required<ElementRef<HTMLSpanElement>>('countDown');
  private ctx: CanvasRenderingContext2D | undefined;

  @Output() isDoneDrawing = new EventEmitter();

  x = 0;
  y = 0;

  minX = 0;
  minY = 0;
  maxX = 0;
  maxY = 0;

  isDrawing = false;
  hasLeftCanvas = false;
  isBlankImage = true;
  
  timeLeft = 0; 

  scoreValues = this.gameConfigService.getScoreSettings();
  score = this.scoreValues.maxScore;
  scoreDecrement = this.scoreValues.scoreDecrement;
  
  clockColor = 'initial';
  private readonly resultImageSize = 1024;
  private readonly LINE_WIDTH = 6;

  private readonly _timeOut = new BehaviorSubject<boolean>(false);
  readonly _timeOut$ = this._timeOut.asObservable();

  guessWord = '';
  AI_GUESS = '';

  prediction: PredictionData | undefined;
  result: Result | undefined;
  hasAddedResult = false;

  hasUpdatedState = false;

  constructor(
    private gameConfigService: GameConfigService,
    private multiplayerService: MultiplayerService,
    private drawingService: DrawingService,
    private imageService: ImageService,
    private soundService: SoundService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.gameConfigService.difficultyLevel$.subscribe(config => {
        this.config = config;
        this.timeLeft = config.secondsPerRound;
      })
    );
    this.multiplayerService.roundIsOver = false;
    const ctx = this.canvas().nativeElement.getContext('2d');
    if (!ctx) {
      throw new Error('getContext failed');
    }
    this.ctx = ctx;
    this.canvas().nativeElement.width =
      this.canvas().nativeElement.parentElement?.offsetWidth || document.body.clientWidth;
    this.canvas().nativeElement.height = document.body.clientHeight - 100;
    this.resetMinMaxMouseValues();
    this.drawingService.guessDone = false;
    if (this.multiplayerService.isMultiplayer) {
      this.setUpMultiplayer();
    }
    this.startGame();
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
  }

  setUpMultiplayer() {
    this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, ready: false };

    this.subscriptions.add(this.predictionListener());

    this.subscriptions.add(this.roundOverListener());
  }

  predictionListener() {
    return this.multiplayerService.predictionListener().subscribe((prediction: PredictionData) => {
      this.prediction = prediction;
      const sortedCertaintyArr = this.sortOnCertainty(prediction);
      this.updateAiGuess(sortedCertaintyArr);
      if (this.prediction && this.prediction.hasWon && !this.hasAddedResult) {
        this.soundService.playResultSound(this.prediction.hasWon);
        this.updateResult(true);
        this.hasAddedResult = true;
      }
    });
  }

  roundOverListener() {
    return this.multiplayerService.roundOverListener().subscribe(() => {
      if (!this.hasAddedResult) {
        this.updateResult(this.prediction ? this.prediction.hasWon : false);
        this.hasAddedResult = true;
      }
    });
  }

  updateResult(won: boolean) {
    const result: Result = this.createResult(won);
    this.drawingService.guessUsed++;
    this.addResultAndResize(result).subscribe({
      next: (dataUrlHighRes) => {
        this.drawingService.lastResult.imageData = dataUrlHighRes;
        this.multiplayerService.changestate(GAMESTATE.intermediateResult);
      },
    });
  }

  createResult(won: boolean) {
    let score = 0;
    if (won) {
      score = this.getScore();
    }
    const result: Result = {
      hasWon: won,
      guess: won ? this.multiplayerService.stateInfo.label ?? '' : this.prediction ? this.prediction.guess : '',
      imageData: '',
      gameState: 'Done',
      score,
      word: this.multiplayerService.stateInfo.label,
      serverRound: this.prediction ? this.prediction.serverRound : 1,
      roundIsDone: true,
    };
    return result;
  }

  addResultAndResize(res: Result): Observable<string> {
    this.drawingService.label = res.word ? res.word : '';
    this.result = res;
    this.drawingService.addResult(this.result);
    const croppedCoordinates: number[] = this.imageService.crop(
      this.minX,
      this.minY,
      this.maxX,
      this.maxY,
      this.LINE_WIDTH
    );
    return this.imageService.resize(
      this.canvas().nativeElement.toDataURL('image/png'),
      croppedCoordinates,
      this.resultImageSize
    );
  }

  getScore() {
    const score = this.score > 0 ? this.score : 0;
    return Math.round(score);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.soundService.stop();
  }

  start(e: MouseEvent | TouchEvent) {
    const { x, y } = this.getClientOffset(e);
    this.x = x;
    this.y = y;
    this.isDrawing = true;
  }

  startGame(): void {
    this.drawingService.classificationDone = false;
    this.subscriptions.add(
      this.createDrawingTimer().subscribe({
        next: () => {
          if (this.multiplayerService.isMultiplayer) {
            this.classify(true);
          } else {
            if (!this.isBlankImage || (this.isBlankImage && this.timeLeft === 0)) {
              this.classify();
            }
          }
        },
        complete: () => {
          this.clockColor = this.clockColor === 'initial' ? 'final' : 'initial';
          this.soundService.sound.stop();
          this.timeOut = true;
          if (this.multiplayerService.isMultiplayer && !this.hasAddedResult) {
            this.updateResult(false);
            this.hasAddedResult = true;
          }
          if (!this.multiplayerService.isMultiplayer && !this.drawingService.hasAddedSingleplayerResult) {
            let res;
            let hasWon = false;
            if (!this.drawingService.pred) {
              res = this.drawingService.createDefaultResult();
            } else {
              res = this.drawingService.createResult(this.drawingService.pred);
              res.imageData = this.result ? this.result.imageData : '';
              hasWon = this.drawingService.pred.hasWon;
            }
            this.soundService.playResultSound(hasWon);
            this.drawingService.addResult(res);
            this.drawingService.updateGameState();
          }
        },
      })
    );
    if (this.drawingService.label) {
      this.guessWord = this.drawingService.label;
    }
    if (this.multiplayerService.isMultiplayer) {
      this.guessWord = this.multiplayerService.label;
    }
  }

  private createDrawingTimer() {
    return new Observable((observer) => {
      let color = 'red';
      const intervalDuration = 100; 

      const sub = interval(intervalDuration)
        .pipe(take(10 * this.config.secondsPerRound))
        .subscribe((tics) => {
          if (!this.drawingService.classificationDone) {
            this.score = this.score - this.scoreDecrement;
            if (tics % 10 === 9) {
              this.timeLeft--;
              if (this.timeLeft < this.config.timeToStartClassify + 1) {
                observer.next('classify');
              }
            }
            if (this.timeLeft <= 5) {
              this.countDown().nativeElement.style.color = color;
              color = color === 'white' ? 'red' : 'white';
              this.soundService.playTickSound();
              this.soundService.playTick = true;
            }
          }
          if (this.timeLeft <= 0) {
            if (this.multiplayerService.isMultiplayer) {
              this.soundService.playResultSound(false);
            }
            observer.complete();
          }
        });
      return () => sub.unsubscribe();
    });
  }

  sortOnCertainty(res: PredictionData) {
    const arr: Certainty[] = [];
    Object.entries(res.certainty).map((keyValue) => {
      const [label, certainty] = keyValue;
      arr.push({ label: label, certainty: certainty });
    });
    arr.sort((a: Certainty, b: Certainty) => {
      return b.certainty - a.certainty;
    });
    if (5 < arr.length) {
      return arr.slice(0, 5);
    }
    return arr;
  }

  updateAiGuess(sortedCertaintyArr: Certainty[]) {
    if (sortedCertaintyArr && sortedCertaintyArr.length > 1) {
      const guess = sortedCertaintyArr[0].label;
      this.AI_GUESS = guess === this.guessWord ? sortedCertaintyArr[1].label : guess;
    }
  }

  handleSinglePlayerClassification(dataUrl: string, croppedCoordinates: number[]) {
    const formData: FormData = this.createFormData(dataUrl);

    this.drawingService.classify(formData).subscribe((res) => {
      const sortedCertaintyArr = this.sortOnCertainty(res);
      this.updateAiGuess(sortedCertaintyArr);
      if (this.drawingService.roundIsDone(res.hasWon, res.gameState)) {
        this.soundService.playResultSound(res.hasWon);
        const score = this.score > 0 ? this.score : 0;
        this.drawingService.lastResult.score = Math.round(score);
        this.imageService
          .resize(this.canvas().nativeElement.toDataURL('image/png'), croppedCoordinates, this.resultImageSize)
          .subscribe({
            next: (dataUrlHighRes) => {
              this.drawingService.lastResult.imageData = dataUrlHighRes;
            },
          });
      } else {
        this.imageService
          .resize(this.canvas().nativeElement.toDataURL('image/png'), croppedCoordinates, this.resultImageSize)
          .subscribe({
            next: (dataUrlHighRes) => {
              if (this.result) {
                this.result.imageData = dataUrlHighRes;
              }
            },
          });
      }
    });
  }

  classify(isMultiplayer = false) { //TODO: rename?
    const b64Image = this.canvas().nativeElement.toDataURL('image/png');
    const croppedCoordinates: number[] = this.imageService.crop(
      this.minX,
      this.minY,
      this.maxX,
      this.maxY,
      this.LINE_WIDTH
    );
    this.imageService.resize(b64Image, croppedCoordinates).subscribe({
      next: (dataUrl) => {
        if (isMultiplayer) {
          const body: { game_id?: string; time_left: number } = {
            game_id: this.multiplayerService.stateInfo.game_id,
            time_left: this.timeLeft,
          };
          const image = this.imageService.createBlob(dataUrl);
          this.multiplayerService.classify(body, image);
        } else {
          this.handleSinglePlayerClassification(dataUrl, croppedCoordinates);
        }
      },
    });
  }

  createFormData(dataUrl: string): FormData {
    const formData: FormData = this.imageService.createFormData(dataUrl);
    formData.append('player_id', this.drawingService.playerid);
    formData.append('time', this.timeLeft.toString());
    formData.append('client_round_num', this.drawingService.guessUsed.toString());
    return formData;
  }

  getClientOffset(event: MouseEvent | TouchEvent) {
    const { pageX, pageY } = event instanceof TouchEvent ? event.touches[0] : event;
    const x = pageX - this.canvas().nativeElement.offsetLeft;
    const y = pageY - this.canvas().nativeElement.offsetTop;

    return { x, y };
  }

  draw(e: MouseEvent | TouchEvent) {
    if (!this.timeOut && this.isDrawing) {
      const { x, y } = this.getClientOffset(e);
      this.drawLine(x, y);
      this.x = x;
      this.y = y;
    }
  }

  leaveCanvas(e: MouseEvent | TouchEvent) {
    this.hasLeftCanvas = true;
    if (this.isDrawing) {
      const { x, y } = this.getClientOffset(e);
      this.drawLine(x, y);
      this.x = x;
      this.y = y;
    }
    this.isDrawing = false;
  }

  enterCanvas(e: MouseEvent | TouchEvent) {
    if (this.isDrawing && this.hasLeftCanvas) {
      const { x, y } = this.getClientOffset(e);
      this.x = x;
      this.y = y;
    }
    this.hasLeftCanvas = false;
  }

  drawLine(currentX: number, currentY: number) {
    if (this.ctx) {
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = this.LINE_WIDTH;
      this.ctx.lineCap = this.ctx.lineJoin = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(currentX, currentY);
      this.ctx.stroke();
    }

    this.isBlankImage = false;

    if (currentX < this.minX) {
      this.minX = currentX;
    }
    if (currentY < this.minY) {
      this.minY = currentY;
    }
    if (currentX > this.maxX) {
      this.maxX = currentX;
    }
    if (currentY > this.maxY) {
      this.maxY = currentY;
    }

    if (this.minX < 0) {
      this.minX = 0;
    }
    if (this.minY < 0) {
      this.minY = 0;
    }
    if (this.maxX > this.canvas().nativeElement.width) {
      this.maxX = this.canvas().nativeElement.width;
    }
    if (this.maxY > this.canvas().nativeElement.height) {
      this.maxY = this.canvas().nativeElement.height;
    }
  }

  clear() {
    const canvas = this.canvas().nativeElement;
    this.ctx?.clearRect(0, 0, canvas.width, canvas.height);
    this.isBlankImage = true;
    this.resetMinMaxMouseValues();
  }

  resetMinMaxMouseValues() {
    this.minX = this.canvas().nativeElement.width;
    this.minY = this.canvas().nativeElement.height;
    this.maxX = 0;
    this.maxY = 0;
  }

  stop(e: MouseEvent | TouchEvent) {
    if (!this.timeOut && this.isDrawing && e instanceof MouseEvent) {
      this.drawLine(e.offsetX, e.offsetY);
      this.isDrawing = false;
    }
  }

  get timeOut(): boolean {
    return this._timeOut.getValue();
  }

  set timeOut(val: boolean) {
    this._timeOut.next(val);
  }
}


