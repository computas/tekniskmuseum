import { Component, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Teknisk Museum';

  userActivity;

  userInactive: Subject<any> = new Subject();
  constructor(private router: Router) {

    this.setTimeout();
    this.userInactive.subscribe(() => this.router.navigateByUrl(''));

  }

  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 3000);
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
}
