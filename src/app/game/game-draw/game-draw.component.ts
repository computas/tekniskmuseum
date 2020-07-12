import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
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
export class GameDrawComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('countDown', { static: true })
  countDown: ElementRef<HTMLSpanElement>;

  private ctx: CanvasRenderingContext2D;

  @Output() isDoneDrawing = new EventEmitter();

  x = 0;
  y = 0;
  isDrawing = false;
  timeLeft = 20.0;

  private readonly _timeOut = new BehaviorSubject<boolean>(false);
  readonly _timeOut$ = this._timeOut.asObservable();

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
    this.startGame();
  }

  start(e: MouseEvent | TouchEvent) {
    const { x, y } = this.getClientOffset(e);
    this.x = x;
    this.y = y;
    this.isDrawing = true;
  }

  startGame(): void {
    this.startDrawingTimer(this.createDrawingTimer());
    if (this.drawingService.label) {
      this.guessWord = this.drawingService.label;
    }
  }

  classify() {
    const b64Image = this.canvas.nativeElement.toDataURL('image/png');

    this.imageService.resize(b64Image).subscribe({
      next: (dataUrl) => {
        const formData: FormData = this.imageService.createFormData(dataUrl);
        formData.append('token', this.drawingService.token);
        // TODO coordinate with backend about time
        formData.append('time', this.timeLeft.toString());
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
    this.ctx.lineWidth = 6;
    this.ctx.lineCap = this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();
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
      interval(100)
        .pipe(take(10 * this.timeLeft))
        .subscribe((tics) => {
          if (tics % 10 === 9) {
            // TODO CALL CLASSIFY
            //
            // this.getDrawingFromCanvasAndCreateFormDataAndClassify();
            this.timeLeft--;
          }
          if (this.timeLeft === 0) {
            observer.complete();
          }
        });
      /*
          switchMap((tics) => {
            if (tics % 10 === 9) {
              if (this.drawingService.guessDone == false) {
                this.classify();
                this.timeLeft--;
              } else {
                this.timeLeft = 0;
              }
            }
            return of(tics);
          })
        )
        .subscribe((tics) => {
          if (this.timeLeft <= 5) {
            this.countDown.nativeElement.style.color = color;
            color = color === 'white' ? 'red' : 'white';
          }
          if (this.timeLeft === 0) {
            observer.complete();
          }
        });*/
    });
  }

  private startDrawingTimer(timer) {
    timer.subscribe({
      complete: () => {
        this.timeOut = true;
        this.classify();
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
