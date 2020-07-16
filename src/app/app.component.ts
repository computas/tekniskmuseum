import { Component, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Teknisk Museum';

  userActivity;
  // userActivity2;
  userInactive: Subject<any> = new Subject();
  // userInactive2: Subject<any> = new Subject();

  constructor(private router: Router) {
    console.log(this.router.url);
    this.setTimeout();

    // this.userInactive.subscribe(() => alert("Spillet starter på nytt om 10 sekunder."));

    this.userInactive.subscribe(() => {
      if (this.router.url != '/') {
        // alert("timeout");
        // this.router.navigateByUrl('');
        console.log(this.router.url, "inaktiv");
        // this.userInactive2.subscribe(() => console.log(this.router.url, "starter igjen"));
        setTimeout(() => console.log(this.router.url, "starter igjen"), 1500);

      }
    });
  }

  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 3000);
    // this.userActivity2 = setTimeout(() => this.userInactive2.next(undefined), 1500);
  }

  //legge til dersom bilde endrer seg? ?
  @HostListener('window:mousemove')
  @HostListener('document:touchmove')
  refreshUserState() {
    clearTimeout(this.userActivity);
    // clearTimeout(this.userActivity2);
    this.setTimeout();
  }
}
