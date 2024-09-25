import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { routes } from '../../shared/models/routes';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TranslationService } from '@/app/core/translation.service';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-idle-timeout',
  templateUrl: './idle-timeout.component.html',
  styleUrls: ['./idle-timeout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatIcon, TranslatePipe],
  animations: [
    trigger('buttonClickEffect', [
      state('normal', style({transform: 'scale(1)',})),
      state('clicked', style({transform: 'scale(1.1)',})),
      transition('normal => clicked', [animate('0.1s ease-out')]),
      transition('clicked => normal', [animate('0.1s ease-in')]),
    ])
  ]
})
export class IdleTimeoutComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<IdleTimeoutComponent>,
    private translationService: TranslationService,
  ) {}

  startTime = 15;
  timer = 0;
  countdown = 0;
  buttonStateHome = 'normal';
  buttonStateCancel = "normal";

  ngOnInit(): void {
    this.timer = this.startTime;
    this.countdown = window.setInterval(() => {
      this.timer -= 1;
      if (this.timer === 0) {
        this.resetTimer();
        this.goHome();
      }
    }, 1000);
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
  }

  goHome() {
    this.buttonStateHome = "clicked";
    setTimeout(() => {
      this.buttonStateHome = "normal";
      setTimeout(() => {
        clearInterval(this.countdown);
        this.dialogRef.close();
        this.router.navigate([routes.LANDING]);
      }, 100)
    }, 100);
  }

  closeDialog() {
    this.buttonStateCancel = "clicked";
    setTimeout(() => {
      this.buttonStateCancel = "normal";
      setTimeout(() => {
        clearInterval(this.countdown);
        this.dialogRef.close();
      }, 100)
    }, 100);
  }

  resetTimer() {
    clearInterval(this.countdown);
    this.timer = this.startTime;
  }

  ngOnDestroy(): void {
    this.resetTimer();
  }
}
