import { Injectable } from '@angular/core';
declare var responsiveVoice;

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  voice: any;
  constructor() {
    this.voice = responsiveVoice;
    this.voice.setDefaultVoice('Norwegian Male');
  }

  speak(speech) {
    this.voice.speak(speech);
  }

  setDefaultVoice(language) {
    this.voice.setDefaultVoice(language);
  }
}
