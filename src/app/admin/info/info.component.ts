import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InfoDialogComponent } from './../info-dialog/info-dialog.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  datasetString = 'Nullstill treningssett';
  datasetBool = false;
  retrainString = 'Tren maskinlæringsmodellen';
  retrainBool = false;
  highScoreString = 'Nullstill poengliste';
  highScoreBool = false;
  errorMsg = 'En feil har oppstådd!';
  constructor(
    private router: Router,
    private loginService: LoginService,
    private _snackBar: MatSnackBar,
    private _dialog: InfoDialogComponent
  ) {
    this.loginService.isAuthenticated().subscribe((res: any) => {
      if (!res.status) {
        this.router.navigate(['admin']);
      }
    });
  }

  ngOnInit(): void {}

  revertDataset() {
    let msg = '';
    if (this.datasetBool) {
      this.resetDatasetValues();
      this.loginService.revertDataset().subscribe(
        (res: any) => {
          if (res.status) {
            msg = 'Suksess! treningssett tilbakestilt!';
          } else {
            msg = this.errorMsg;
          }
          this.openSnackBar(msg);
        },
        (error) => {
          msg = this.errorMsg;
          this.openSnackBar(msg);
        }
      );
      this.resetDatasetValues();
    } else {
      this.resetHighScoreValues();
      this.resetRetrainValues();
      this.setDatasetValues();
    }
  }

  retrain() {
    let msg = '';
    if (this.retrainBool) {
      this.resetDatasetValues();
      this.loginService.revertDataset().subscribe(
        (res: any) => {
          if (res.status) {
            msg = 'Suksess! Modellen blir trent!';
          } else {
            msg = this.errorMsg;
          }
          this.openSnackBar(msg);
        },
        (error) => {
          msg = this.errorMsg;
          this.openSnackBar(msg);
        }
      );
      this.resetRetrainValues();
    } else {
      this.resetDatasetValues();
      this.resetHighScoreValues();
      this.setRetrainValues();
    }
  }

  clearHighScore() {
    let msg = '';
    if (this.highScoreBool) {
      this.resetDatasetValues();
      this.loginService.revertDataset().subscribe(
        (res: any) => {
          if (res.status) {
            msg = 'Suksess! Poengliste nullstilt!';
          } else {
            msg = this.errorMsg;
          }
          this.openSnackBar(msg);
        },
        (error) => {
          msg = this.errorMsg;
          this.openSnackBar(msg);
        }
      );
      this.resetHighScoreValues();
    } else {
      this.resetDatasetValues();
      this.resetRetrainValues();
      this.setHighScoreValues();
    }
  }

  resetHighScoreValues() {
    this.highScoreString = 'Nullstill poengliste';
    this.highScoreBool = false;
  }

  resetRetrainValues() {
    this.retrainString = 'Tren maskinlæringsmodellen';
    this.retrainBool = false;
  }

  resetDatasetValues() {
    this.datasetString = 'Nullstill treningssett til originalen';
    this.datasetBool = false;
  }

  setHighScoreValues() {
    this.highScoreString = 'Er du sikker?';
    this.highScoreBool = true;
  }

  setRetrainValues() {
    this.retrainString = 'Er du sikker?';
    this.retrainBool = true;
  }

  setDatasetValues() {
    this.datasetString = 'Er du sikker?';
    this.datasetBool = true;
  }

  signOut() {
    this.loginService.signOut();
  }

  getInformation() {
    this.loginService.getStatus().subscribe(
      (res: any) => {
        this._dialog.openDialog();
      },
      (error) => {
        // This is correct
        this.openSnackBar(this.errorMsg);
        // load mock-card with mock information
        this._dialog.openDialog();
      }
    );
  }

  openSnackBar(msg = 'suksess!') {
    this._snackBar.open(msg, 'Lukk', {
      duration: 4000,
    });
  }
}
