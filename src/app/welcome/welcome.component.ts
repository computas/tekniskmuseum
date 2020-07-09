import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../shared/models/routes';
import { SPEECH } from '../shared/speech-text/text';
import { SpeechService } from '../services/speech.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private speechService: SpeechService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  speakIntro() {
    this.speechService.speak(SPEECH.welcome);
  }

  goToGameInfoPage() {
    this.router.navigate([routes.PLAYGAME]);
  }

  goToHighscore() {
    this.router.navigate([routes.HIGHSCORE]);
  }
}
