import { Component, OnInit } from '@angular/core';
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
  datasetString = 'Nullstill treningssett til originalen';
  datasetBool = false;
  retrainString = 'Tren maskinlæringsmodellen';
  retrainBool = false;
  highScoreString = 'Nullstill poengliste';
  highScoreBool = false;
  errorMsg = 'En tilkoblingsfeil har oppstådd!';
  secondMsg = 'Er du helt sikker?';
  constructor(
    private router: Router,
    private loginService: LoginService,
    private _snackBar: MatSnackBar,
    private _dialog: InfoDialogComponent
  ) {}

  ngOnInit(): void {}

  revertDataset() {
    let msg = '';
    if (this.datasetBool) {
      this.resetDatasetValues();
      this.loginService.revertDataset().subscribe(
        (res: any) => {
          if (res.success === 'OK') {
            msg = 'Suksess! treningssett tilbakestilles (dette kan ta noen minutter)';
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
      this.loginService.retrain().subscribe(
        (res: any) => {
          if (res.success === 'OK') {
            msg = 'Suksess! Modellen blir trent (dette kan ta noen minutter)';
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
      this.loginService.clearHighScore().subscribe(
        (res: any) => {
          if (res.success === 'OK') {
            msg = 'Suksess! Poengliste nullstilles (dette kan ta noen minutter)';
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

  resetAll() {
    this.resetHighScoreValues();
    this.resetRetrainValues();
    this.resetDatasetValues();
  }

  setHighScoreValues() {
    this.highScoreString = this.secondMsg;
    this.highScoreBool = true;
  }

  setRetrainValues() {
    this.retrainString = this.secondMsg;
    this.retrainBool = true;
  }

  setDatasetValues() {
    this.datasetString = this.secondMsg;
    this.datasetBool = true;
  }

  signOut() {
    this.loginService.signOut().subscribe(
      (res: any) => {
        if (res.success === 'OK') {
          this.router.navigate(['admin']);
          this.openSnackBar('Du er logget ut!');
        } else {
          this.router.navigate(['admin']);
          this.openSnackBar('En feil har oppstådd!');
        }
      },
      (error) => {
        this.router.navigate(['admin']);
        this.openSnackBar(this.errorMsg);
      }
    );
  }

  getInformation() {
    this.resetAll();
    this.loginService.getStatus().subscribe(
      (res: any) => {
        const data = JSON.parse(res);
        const name = data.CV_iteration_name;
        const time = data.CV_time_created;
        const count = data.BLOB_IMAGE_COUNT;
        this._dialog.openDialog(name, time, count);
      },
      (error) => {
        this.openSnackBar(this.errorMsg);
      }
    );
  }

  openSnackBar(msg = 'suksess!') {
    this._snackBar.open(msg, 'Lukk', {
      duration: 6000,
    });
  }
}
