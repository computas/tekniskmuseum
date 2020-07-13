import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, interval, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { ImageService } from './services/image.service';
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
  timeLeft = 20.0;
  timeElapsed = 0.0;
  userDrawLineWidth = 10;

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

    this.minX = this.canvas.nativeElement.width;
    this.minY = this.canvas.nativeElement.height;
    this.maxX = 0;
    this.maxY = 0;

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
    this.createDrawingTimer().subscribe({
      next: (val) => {
        this.classify();
      },
      complete: () => {
        this.timeOut = true;
      },
    });
    if (this.drawingService.label) {
      this.guessWord = this.drawingService.label;
    }
  }

  private createDrawingTimer() {
    return new Observable((observer) => {
      interval(100)
        .pipe(take(10 * this.timeLeft), takeUntil(this.unsubscribe))
        .subscribe((tics) => {
          if (!this.drawingService.classificationDone) {
            if (tics % 10 === 9) {
              this.timeLeft--;
              this.timeElapsed++;
              if (this.timeElapsed > 3) {
                observer.next('classify');
              }
            }
          }
        });
    });
  }

  classify() {
    const b64Image = this.canvas.nativeElement.toDataURL('image/png');

    this.imageService.resize(b64Image, this.minX, this.minY, this.maxX, this.maxY, this.userDrawLineWidth).subscribe({
      next: (dataUrl) => {
        const formData: FormData = this.createFormData(dataUrl);
        this.drawingService.classify(formData, dataUrl).subscribe();
      },
    });
  }

  createFormData(dataUrl): FormData {
    const formData: FormData = this.imageService.createFormData(dataUrl);
    formData.append('token', this.drawingService.token);
    formData.append('time', this.timeElapsed.toString());
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

  drawLine(currentX, currentY) {
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = this.userDrawLineWidth;
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

  get timeOut(): boolean {
    return this._timeOut.getValue();
  }

  set timeOut(val: boolean) {
    this._timeOut.next(val);
  }
}
