import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  constructor(private router: Router, private loginService: LoginService, private _snackBar: MatSnackBar) {}

  login(username: string, password: string) {
    // Call on login service to authorize user
    this.loginService.login(username, password).subscribe(
      (res: any) => {
        if (res.success === 'OK') {
          this.loginService.setLoggedIn();
          this.router.navigate(['admin/info']);
        } else {
          this.openSnackBar('Feil brukernavn eller passord!');
        }
      },
      () => {
        this.openSnackBar('En feil har oppstådd!');
      }
    );
  }

  openSnackBar(msg = 'suksess!') {
    this._snackBar.open(msg, 'Lukk', {
      duration: 4000,
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
