import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { IdleTimeoutComponent } from './game/idle-timeout/idle-timeout.component';
import { routeTransitionAnimations } from './route-transition-animations';
import { environment } from '../environments/environment';
import { GameStateService } from './game/services/game-state-service';
import { GAMESTATE } from './shared/models/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitionAnimations],
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'Teknisk Museum';
  userActivity = 0;
  userInactive = new Subject<boolean | undefined>();
  inactivityTime = environment.inactivityTime;

  constructor(private gameStateService: GameStateService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.setDialogTimeout();
    
    //Whenever currentPage changes, reset inactivity timer. 
    this.gameStateService.currentPage$.subscribe(() => {
      this.setDialogTimeout();
      //If an inactivity prompt is open, close it. Important for multiplayer mode! 
      this.closeDialog();
    })

    //Whenever user become inactive (25sec) -> open prompt. 
    this.userInactive.subscribe(() => { 
      //Never open prompt on drawing page. 
      if (this.gameStateService.getCurrentPage() === GAMESTATE.drawingBoard) {
        this.setDialogTimeout();
      }

      if (this.router.url === '/welcome') {
        this.router.navigate(['/']);
      } else if (this.router.url !== '/' && !this.router.url.startsWith('/admin')) {
        this.openDialog();
      }
    });
  }

  openDialog() {
    if (this.dialog.openDialogs.length < 1) {
      this.dialog
        .open(IdleTimeoutComponent)
    }
  }

  closeDialog() {
    if (this.dialog.openDialogs.length > 0) {
      this.dialog.closeAll();
    }
  }

  setDialogTimeout() {
    clearTimeout(this.userActivity);
    this.userActivity = window.setTimeout(() => this.userInactive.next(undefined), this.inactivityTime);
  }

  prepareRoute(outlet: RouterOutlet) {
    const animationState = 'animationState';
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData[animationState];
  }

  @HostListener('window:mousemove')
  @HostListener('document:touchmove')
  refreshUserState() {
    this.setDialogTimeout();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  @HostListener('gesturestart', ['$event'])
  onGestureStart(event: Event): void {
    event.preventDefault();
  }

  @HostListener('gesturechange', ['$event'])
  onGestureChange(event: Event): void {
    event.preventDefault();
  }

  @HostListener('gestureend', ['$event'])
  onGestureEnd(event: Event): void {
    event.preventDefault();
  }
}
