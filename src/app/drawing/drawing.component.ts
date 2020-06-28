import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { take, delay } from 'rxjs/operators';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss'],
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
export class DrawingComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('countDown', { static: true })
  countDown: ElementRef<HTMLSpanElement>;
  x = 0;
  y = 0;
  gameOver = new BehaviorSubject<boolean>(false);
  isDrawing = false;
  timeLeft = 10;
  times = [];
  words = [];
  guessWord = 'Cat';
  private ctx: CanvasRenderingContext2D;
  currentState = 'initial';

  constructor() {}

  ngOnInit(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      throw new Error('getContext failed');
    }

    this.ctx = ctx;
    this.canvas.nativeElement.width = document.body.clientWidth;
    this.canvas.nativeElement.height = document.body.clientHeight;
    this.startGame();
  }

  submitAnswer() {
    this.createFormData();
  }

  start(e: MouseEvent | TouchEvent) {
    const { x, y } = this.getClientOffset(e);
    this.x = x;
    this.y = y;
    this.isDrawing = true;
  }

  startGame() {
    this.startDrawingTimer(this.createDrawingTimer());

    // TODO FETCH WORD FROM BACKEND
  }

  getClientOffset(event) {
    const { pageX, pageY } = event.touches ? event.touches[0] : event;
    const x = pageX - this.canvas.nativeElement.offsetLeft;
    const y = pageY - this.canvas.nativeElement.offsetTop;

    return { x, y };
  }

  draw(e: MouseEvent | TouchEvent) {
    if (!this.gameOver.getValue() && this.isDrawing) {
      const { x, y } = this.getClientOffset(e);
      this.drawLine(this.x, this.y, x, y);
      this.x = x;
      this.y = y;
    }
  }

  clear() {
    const canvas = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    this.gameOver.next(false);
    this.timeLeft = 10;
    this.countDown.nativeElement.style.color = 'white';
    this.startGame();
  }

  drawLine(x1, y1, x2, y2) {
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 6;
    this.ctx.lineCap = this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  stop(e) {
    if (!this.gameOver.getValue() && this.isDrawing) {
      this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
      this.isDrawing = false;
    }
  }

  private createDrawingTimer() {
    return new Observable((observer) => {
      let color = 'red';
      interval(100)
        .pipe(take(10 * this.timeLeft))
        .subscribe((tics) => {
          if (tics % 10 === 9) {
            this.timeLeft--;
          }
          if (this.timeLeft <= 5) {
            this.countDown.nativeElement.style.color = color;
            color = color === 'white' ? 'red' : 'white';
          }
          if (this.timeLeft === 0) {
            observer.complete();
          }
        });
    });
  }

  private startDrawingTimer(timer) {
    timer.subscribe({
      complete: () => {
        this.gameOver.next(true);
        this.currentState =
          this.currentState === 'initial' ? 'final' : 'initial';
        this.submitAnswer();
      },
    });
  }

  b64ToUint8Array(b64Image) {
    const img = atob(b64Image.split(',')[1]);
    const imgBuffer: number[] = [];
    let i = 0;
    while (i < img.length) {
      imgBuffer.push(img.charCodeAt(i));
      i++;
    }
    return new Uint8Array(imgBuffer);
  }

  resize(b64Image, callback) {
    const img = new Image();

    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    if (!ctx) {
      throw new Error('getContext failed');
    }
    img.onload = () => {
      c.width = 256;
      c.height = 256;
      ctx.drawImage(img, 0, 0, c.width, c.height);
      callback(c.toDataURL('image/png', 1));
    };
    img.src = b64Image;
  }

  createFormData() {
    const b64Image = this.canvas.nativeElement.toDataURL('image/png');
    const callback = (dataUrl) => {
      const u8Image = this.b64ToUint8Array(dataUrl);
      const formData = new FormData();
      formData.append('image', new Blob([u8Image], { type: 'image/png' }));
      // TODO send data to server
    };
    this.resize(b64Image, callback);
  }
}
