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
@Component({
  selector: 'app-idle-timeout',
  templateUrl: './idle-timeout.component.html',
  styleUrls: ['./idle-timeout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CdkScrollable, 
    MatDialogContent, 
    MatDialogActions, 
    MatButton, 
    MatIcon, 
    TranslatePipe
  ],
})
export class IdleTimeoutComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<IdleTimeoutComponent>,
    private translationService: TranslationService
  ) {}

  startTime = 15;
  timer = 0;
  countdown = 0;

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
    this.closeDialog();
    this.router.navigate([routes.LANDING]);
  }

  closeDialog() {
    clearInterval(this.countdown);
    this.dialogRef.close();
  }

  resetTimer() {
    clearInterval(this.countdown);
    this.timer = this.startTime;
  }

  ngOnDestroy(): void {
    this.resetTimer();
  }
}
