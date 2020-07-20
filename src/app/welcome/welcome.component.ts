import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../shared/models/routes';
import { SPEECH } from '../shared/speech-text/text';
import { SpeechService } from '../services/speech.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router, private speechService: SpeechService) {}

  ngOnInit() {}

  speakIntro() {
    this.speechService.speak(SPEECH.welcome);
  }

  goToGameModePage() {
    this.router.navigate([routes.GAMEMODE]);
  }
}
