import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, interval, Observable } from 'rxjs';
import { ImageService } from './services/image.service';
import { Howl } from 'howler';
import { take, takeUntil } from 'rxjs/operators';
import { DrawingService } from './services/drawing.service';
import { StartGameInfo } from './services/start-game-info';

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
  isBlankImage = true;

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

  constructor(private imageService: ImageService, private drawingService: DrawingService) { }

  ngOnInit(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      throw new Error('getContext failed');
    }

    this.ctx = ctx;
    this.canvas.nativeElement.width = this.canvas.nativeElement.parentElement?.offsetWidth || document.body.clientWidth;
    this.canvas.nativeElement.height = document.body.clientHeight - 100;
    this.resetMinMaxMouseValues();
    this.drawingService.guessDone = false;
    this.startGame();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
        if (!this.isBlankImage || this.isBlankImage && this.timeLeft === 0) {
          this.classify();
        }
      },
      complete: () => {
        this.clockColor = this.clockColor === 'initial' ? 'final' : 'initial';
        this.sound.stop();
        this.timeOut = true;
      },
    });
    if (this.drawingService.label) {
      this.guessWord = this.drawingService.label;
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
              if (this.timeLeft < 16) {
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
    this.isBlankImage = true;
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
