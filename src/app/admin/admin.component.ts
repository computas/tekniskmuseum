import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  constructor(private router: Router, private loginService: LoginService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  login(username, password) {
    // Call on login service to authorize user
    this.loginService.login(username, password).subscribe(
      (res: any) => {
        if (res.status) {
          this.loginService.setLoggedIn();
          this.router.navigate(['admin/info']);
        } else {
          this.openSnackBar('Feil brukernavn eller passord!');
        }
      },
      (error) => {
        this.openSnackBar('En feil har oppstådd!');
      }
    );
    this.loginService.setLoggedIn();
    this.router.navigate(['admin/info']);
  }

  openSnackBar(msg = 'suksess!') {
    this._snackBar.open(msg, 'Lukk', {
      duration: 4000,
    });
  }
}
