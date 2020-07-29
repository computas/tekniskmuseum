import { Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  sound = new Howl({
    src: ['../../../../assets/tick.mp3'],
  });
  playTick = false;

  constructor() {}

  playTickSound() {
    if (!this.playTick) {
      this.sound.play();
    }
  }

  stop() {
    this.sound.stop();
    this.playTick = false;
  }

  playResultSound(hasWon: boolean) {
    if (hasWon) {
      const sound = new Howl({
        src: ['../../../../assets/win.mp3'],
      });
      sound.play();
    } else {
      const sound = new Howl({
        src: ['../../../../assets/loss.mp3'],
      });
      sound.play();
    }
  }
}
