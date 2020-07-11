import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, interval, Observable, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { take } from 'rxjs/operators';
import { ImageService } from './services/image.service';
import { DrawingService } from './services/drawing.service';
import { StartGameInfo } from './services/start-game-info';

@Component({
  selector: 'app-drawing',
  templateUrl: './game-draw.component.html',
  styleUrls: ['./game-draw.component.scss'],
  animations: [
    trigger('changeDivSize', [
      state(
        'initial',
        style({
          width: '100%',
          color: 'white',
          height: '0',
        })
      ),
      state(
        'final',
        style({
          backgroundColor: 'red',
          height: '100%',
          'text-align': 'center',
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        })
      ),

      transition('initial=>final', animate('300ms')),
      transition('final=>initial', animate('300ms')),
    ]),
  ],
})
export class GameDrawComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('countDown', { static: true })
  countDown: ElementRef<HTMLSpanElement>;

  private ctx: CanvasRenderingContext2D;
  clockColor = 'initial';

  @Output() isDoneDrawing = new EventEmitter();

  x = 0;
  y = 0;

  xValues: number[] = [];
  yValues: number[] = [];

  isDrawing = false;
  timeLeft = 20.0;
  timeElapsed = 0.0;
  userDrawLineWidth = 30;

  private readonly _timeOut = new BehaviorSubject<boolean>(false);
  readonly _timeOut$ = this._timeOut.asObservable();

  private unsubscribe = new Subject<void>();

  startGameInfo: StartGameInfo;
  guessWord: string;

  constructor(private imageService: ImageService, private drawingService: DrawingService) {}

  ngOnInit(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      throw new Error('getContext failed');
    }

    this.ctx = ctx;
    this.canvas.nativeElement.width = this.canvas.nativeElement.parentElement?.offsetWidth || document.body.clientWidth;
    this.canvas.nativeElement.height = document.body.clientHeight - 100;
    this.drawingService.guessDone = false;
    this.startGame();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  start(e: MouseEvent | TouchEvent) {
    const { x, y } = this.getClientOffset(e);
    this.x = x;
    this.y = y;
    this.isDrawing = true;
  }

  startGame(): void {
    this.drawingService.classificationDone = false;
    this.startDrawingTimer(this.createDrawingTimer());
    if (this.drawingService.label) {
      this.guessWord = this.drawingService.label;
    }
  }

  classify() {
    const b64Image = this.canvas.nativeElement.toDataURL('image/png');

    let paddingForLineWidth = this.userDrawLineWidth / 2;
    let paddingExtra = 20;
    let paddingTotal = paddingForLineWidth + paddingExtra;

    let minX = Math.min(...this.xValues);
    let minY = Math.min(...this.yValues);
    let maxX = Math.max(...this.xValues);
    let maxY = Math.max(...this.yValues);

    let userDrawingWidth = maxX - minX;
    let userDrawingHeight = maxY - minY;

    let squareCenterX = minX + userDrawingWidth / 2;
    let squareCenterY = minY + userDrawingHeight / 2;
    let squareSize = Math.max(userDrawingWidth, userDrawingHeight);

    let sx = squareCenterX - squareSize / 2 - paddingTotal;
    let sy = squareCenterY - squareSize / 2 - paddingTotal;
    let sw = squareSize + paddingTotal * 2;
    let sh = squareSize + paddingTotal * 2;

    this.imageService.resize(b64Image, sx, sy, sw, sh).subscribe({
      next: (dataUrl) => {
        const formData: FormData = this.imageService.createFormData(dataUrl);
        formData.append('token', this.drawingService.token);
        formData.append('time', this.timeElapsed.toString());
        this.drawingService.classify(formData, dataUrl).subscribe();
      },
    });
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

  drawLine(currentX, currentY) {
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = this.userDrawLineWidth;
    this.ctx.lineCap = this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();

    this.xValues.push(currentX);
    this.yValues.push(currentY);
  }

  clear() {
    const canvas = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  stop(e) {
    if (!this.timeOut && this.isDrawing) {
      this.drawLine(e.offsetX, e.offsetY);
      this.isDrawing = false;
    }
  }

  private createDrawingTimer() {
    return new Observable((observer) => {
      let color = 'red';
      interval(100)
        .pipe(take(10 * this.timeLeft), takeUntil(this.unsubscribe))
        .subscribe((tics) => {
          if (!this.drawingService.classificationDone) {
            if (tics % 10 === 9) {
              this.timeLeft--;
              this.timeElapsed++;
              this.classify();
            }
            if (this.timeLeft <= 5) {
              this.countDown.nativeElement.style.color = color;
              color = color === 'white' ? 'red' : 'white';
            }
          }
        });
    });
  }

  private startDrawingTimer(timer) {
    timer.subscribe({
      complete: () => {
        this.timeOut = true;
        this.clockColor = this.clockColor === 'initial' ? 'final' : 'initial';
      },
    });
  }

  get timeOut(): boolean {
    return this._timeOut.getValue();
  }

  set timeOut(val: boolean) {
    this._timeOut.next(val);
  }
}
