import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('countDown', { static: true })
  countDown: ElementRef<HTMLSpanElement>;
  x = 0;
  y = 0;
  isDrawing = false;
  guessWord = 'Cat';
  timer = 20;
  gameOver = false;
  private ctx: CanvasRenderingContext2D;

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
    this.drawInit();
  }

  start(e: MouseEvent) {
    this.x = e.offsetX;
    this.y = e.offsetY;
    this.isDrawing = true;
  }

  startGame() {
    //TODO FETCH WORD FROM BACKEND
  }

  draw(e: MouseEvent) {
    if (!this.gameOver && this.isDrawing) {
      this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
      this.x = e.offsetX;
      this.y = e.offsetY;
    }
  }

  clear() {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
  }

  drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 5;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  stop(e) {
    if (!this.gameOver && this.isDrawing) {
      this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
      this.x = 0;
      this.y = 0;
      this.isDrawing = false;
    }
  }

  private drawInit() {
    let color = 'red';
    let changeColorInterval;
    const interval = setInterval(() => {
      if (this.timer <= 5 && !changeColorInterval) {
        changeColorInterval = setInterval(() => {
          this.countDown.nativeElement.style.color = color;
          color = color === 'white' ? 'red' : 'white';
        }, 100);
      }
      if (this.timer === 0) {
        this.gameOver = true;
        clearInterval(interval);
        clearInterval(changeColorInterval);
        window.alert('Game over');
      }
      if (this.timer !== 0) {
        this.timer -= 1;
      }
    }, 1000);
  }
}
