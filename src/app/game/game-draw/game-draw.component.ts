import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, interval, Observable, Subscription } from 'rxjs';
import { ImageService } from './services/image.service';
import { Howl } from 'howler';
import { take, takeUntil } from 'rxjs/operators';
import { DrawingService } from './services/drawing.service';
import { StartGameInfo } from './services/start-game-info';
import { MultiplayerService, GAMELEVEL } from 'src/app/multiplayer/services/multiplayer.service';
import { Result } from 'src/app/shared/models/result.interface';

@Component({
  selector: 'app-drawing',
  templateUrl: './game-draw.component.html',
  styleUrls: ['./game-draw.component.scss'],
})
export class GameDrawComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('countDown', { static: true })
  countDown: ElementRef<HTMLSpanElement>;

  private ctx: CanvasRenderingContext2D;

  @Output() isDoneDrawing = new EventEmitter();

  x = 0;
  y = 0;

  minX;
  minY;
  maxX;
  maxY;

  isDrawing = false;
  hasLeftCanvas = false;
  timeLeft = 20.0;

  score = 333;

  playTick = false;
  sound = new Howl({
    src: ['../../../assets/tick.mp3'],
  });

  clockColor = 'initial';
  private readonly resultImageSize = 1024;

  private readonly LINE_WIDTH = 6;

  private readonly _timeOut = new BehaviorSubject<boolean>(false);
  readonly _timeOut$ = this._timeOut.asObservable();

  private unsubscribe = new Subject<void>();

  startGameInfo: StartGameInfo;
  guessWord: string;
  AI_GUESS: string;

  prediction: any;
  result: Result;
  hasAddedResult = false;

  roundOverSubscription: Subscription;
  predictionSubscription: Subscription;
  hasUpdatedState = false;

  constructor(
    private imageService: ImageService,
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService
  ) {}

  ngOnInit(): void {
    this.multiplayerService.roundIsOver = false;
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      throw new Error('getContext failed');
    }
    this.ctx = ctx;
    this.canvas.nativeElement.width = this.canvas.nativeElement.parentElement?.offsetWidth || document.body.clientWidth;
    this.canvas.nativeElement.height = document.body.clientHeight - 100;
    this.resetMinMaxMouseValues();
    this.drawingService.guessDone = false;
    if (this.multiplayerService.isMultiplayer) {
      this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, ready: false };
      this.predictionSubscription = this.multiplayerService.predictionListener().subscribe((prediction: any) => {
        const sortedCertaintyArr = this.sortOnCertainty(prediction);
        let multiplayerGameState = false;
        this.prediction = prediction;
        if (sortedCertaintyArr && sortedCertaintyArr.length > 1) {
          this.AI_GUESS = sortedCertaintyArr[0].label;
        }
        if (this.timeLeft <= 0) {
          this.hasLossFunction();
          multiplayerGameState = true;
        } else {
          if (prediction && prediction.hasWon) {
            this.hasWonFunction(prediction);
            console.log('haswon');
            multiplayerGameState = true;
          }
        }
        if (multiplayerGameState) {
          this.updateResultAtEndOfGame();
        }
      });
      this.roundOverSubscription = this.multiplayerService.roundOverListener().subscribe((roundOver: any) => {
        console.log('ROUND_OVER', roundOver);
      });
    }
    this.startGame();
  }

  updateResultAtEndOfGame() {
    if (!this.hasUpdatedState) {
      console.log('SHOULD ONLY RUN ONCE');
      console.log('this.prediction', this.prediction);
      if (this.prediction && this.prediction.hasWon) {
        this.hasWonFunction(this.prediction);
      } else {
        this.hasLossFunction();
      }
      if (!this.hasAddedResult) {
        this.drawingService.addResult(this.result);
        this.hasAddedResult = true;
      }
      this.drawingService.guessUsed++;
      const guess = this.multiplayerService.stateInfo.guessUsed;
      const guessUsed = guess ? guess : 0;
      this.multiplayerService.stateInfo = {
        ...this.multiplayerService.stateInfo,
        guessUsed: guessUsed + 1,
        gameLevel: GAMELEVEL.intermediateResult,
      };
    }
    this.hasUpdatedState = true;
  }

  hasWonFunction(prediction) {
    this.playResultSound(true);
    const obj: Result = {
      hasWon: true,
      guess: prediction.guess,
      imageData: '',
      gameState: 'Done',
      score: this.getScore(),
      word: this.multiplayerService.stateInfo.label,
    };
    console.log('hasWonFunction', obj);
    this.createResultAndResize(obj);
  }

  hasLossFunction() {
    const obj: Result = {
      hasWon: false,
      guess: '',
      imageData: '',
      gameState: 'Done',
      score: 0,
      word: this.multiplayerService.stateInfo.label,
    };
    console.log('hasLossfunction', obj);
    this.createResultAndResize(obj);
  }
  createResultAndResize(obj) {
    this.drawingService.label = obj.word;
    const result: Result = this.drawingService.createResult(obj);
    this.result = result;
    const croppedCoordinates: any = this.imageService.crop(this.minX, this.minY, this.maxX, this.maxY, this.LINE_WIDTH);
    this.resizeImage(croppedCoordinates);
  }

  getScore() {
    const score = this.score > 0 ? this.score : 0;
    return Math.round(score);
  }

  resizeImage(croppedCoordinates) {
    this.imageService
      .resize(this.canvas.nativeElement.toDataURL('image/png'), croppedCoordinates, this.resultImageSize)
      .subscribe({
        next: (dataUrlHighRes) => {
          this.result.imageData = dataUrlHighRes;
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.roundOverSubscription.unsubscribe();
    this.predictionSubscription.unsubscribe();
    this.sound.stop();
  }

  start(e: MouseEvent | TouchEvent) {
    const { x, y } = this.getClientOffset(e);
    this.x = x;
    this.y = y;
    this.isDrawing = true;
  }

  startGame(): void {
    this.drawingService.classificationDone = false;
    this.createDrawingTimer().subscribe({
      next: (val) => {
        if (this.multiplayerService.isMultiplayer) {
          this.classifyMultiplayer();
        } else {
          this.classify();
        }
      },
      complete: () => {
        this.clockColor = this.clockColor === 'initial' ? 'final' : 'initial';
        this.sound.stop();
        this.timeOut = true;
        if (this.multiplayerService.isMultiplayer) {
          console.log('COMPLETEEVENT');
          this.updateResultAtEndOfGame();
          //this.classifyMultiplayer();
        }
      },
    });
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
      interval(100)
        .pipe(take(10 * this.timeLeft), takeUntil(this.unsubscribe))
        .subscribe((tics) => {
          if (!this.drawingService.classificationDone) {
            this.score = this.score - 1.67336683417;
            if (tics % 10 === 9) {
              this.timeLeft--;
              if (this.timeLeft < 17) {
                observer.next('classify');
              }
            }
            if (this.timeLeft <= 5) {
              this.countDown.nativeElement.style.color = color;
              color = color === 'white' ? 'red' : 'white';
              this.playTickSound();
              this.playTick = true;
            }
          }
          if (this.timeLeft <= 0) {
            if (this.multiplayerService.isMultiplayer) {
              observer.complete();
            }
          }
        });
    });
  }

  sortOnCertainty(res) {
    const arr: any = [];
    Object.entries(res.certainty).map((keyValue) => {
      const [label, certainty] = keyValue;
      arr.push({ label, certainty });
    });
    arr.sort((a: any, b: any) => {
      return b.value - a.value;
    });
    if (5 < arr.length) {
      return arr.slice(0, 5);
    }
    return arr;
  }

  playTickSound() {
    if (!this.playTick) {
      this.sound.play();
    }
  }

  playResultSound(hasWon: boolean) {
    if (hasWon) {
      const sound = new Howl({
        src: ['../../../assets/win.mp3'],
      });
      sound.play();
    } else {
      const sound = new Howl({
        src: ['../../../assets/loss.mp3'],
      });
      sound.play();
    }
  }

  classifyMultiplayer() {
    const b64Image = this.canvas.nativeElement.toDataURL('image/png');
    const croppedCoordinates: any = this.imageService.crop(this.minX, this.minY, this.maxX, this.maxY, this.LINE_WIDTH);
    this.imageService.resize(b64Image, croppedCoordinates).subscribe({
      next: (dataUrl) => {
        const body = {
          game_id: this.multiplayerService.stateInfo.game_id,
          time_left: this.timeLeft,
        };
        const image = this.imageService.createBlob(dataUrl);
        this.multiplayerService.classify(body, image);
      },
    });
  }

  classify() {
    const b64Image = this.canvas.nativeElement.toDataURL('image/png');
    const croppedCoordinates: any = this.imageService.crop(this.minX, this.minY, this.maxX, this.maxY, this.LINE_WIDTH);
    this.imageService.resize(b64Image, croppedCoordinates).subscribe({
      next: (dataUrl) => {
        const formData: FormData = this.createFormData(dataUrl);
        this.drawingService.classify(formData).subscribe((res) => {
          const sortedCertaintyArr = this.sortOnCertainty(res);
          if (sortedCertaintyArr && sortedCertaintyArr.length > 1) {
            this.AI_GUESS = sortedCertaintyArr[0].label;
          }
          if (res.roundIsDone) {
            this.playResultSound(res.hasWon);
            const score = this.score > 0 ? this.score : 0;
            this.drawingService.lastResult.score = Math.round(score);
            this.imageService
              .resize(this.canvas.nativeElement.toDataURL('image/png'), croppedCoordinates, this.resultImageSize)
              .subscribe({
                next: (dataUrlHighRes) => {
                  this.drawingService.lastResult.imageData = dataUrlHighRes;
                },
              });
          }
        });
      },
    });
  }

  createFormData(dataUrl): FormData {
    const formData: FormData = this.imageService.createFormData(dataUrl);
    formData.append('player_id', this.drawingService.playerid);
    formData.append('time', this.timeLeft.toString());
    return formData;
  }

  getClientOffset(event) {
    const { pageX, pageY } = event.touches ? event.touches[0] : event;
    const x = pageX - this.canvas.nativeElement.offsetLeft;
    const y = pageY - this.canvas.nativeElement.offsetTop;

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
  }

  enterCanvas(e: MouseEvent | TouchEvent) {
    if (this.isDrawing && this.hasLeftCanvas) {
      const { x, y } = this.getClientOffset(e);
      this.x = x;
      this.y = y;
    }
    this.hasLeftCanvas = false;
  }

  drawLine(currentX, currentY) {
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = this.LINE_WIDTH;
    this.ctx.lineCap = this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();

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
    if (this.maxX > this.canvas.nativeElement.width) {
      this.maxX = this.canvas.nativeElement.width;
    }
    if (this.maxY > this.canvas.nativeElement.height) {
      this.maxY = this.canvas.nativeElement.height;
    }
  }

  clear() {
    const canvas = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.resetMinMaxMouseValues();
  }

  resetMinMaxMouseValues() {
    this.minX = this.canvas.nativeElement.width;
    this.minY = this.canvas.nativeElement.height;
    this.maxX = 0;
    this.maxY = 0;
  }

  stop(e) {
    if (!this.timeOut && this.isDrawing) {
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
