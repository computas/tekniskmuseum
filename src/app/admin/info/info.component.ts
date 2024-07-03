import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InfoDialogComponent } from './../info-dialog/info-dialog.component';
import { PairingService } from '../../game/game-multiplayer/services/pairing.service';
import { MatButton } from '@angular/material/button';
import { StatusData } from '@/app/shared/models/backend-interfaces';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  standalone: true,
  imports: [MatButton],
})
export class InfoComponent {
  datasetString = 'Nullstill treningssett til originalen';
  datasetBool = false;
  retrainString = 'Tren maskinlæringsmodellen';
  retrainBool = false;
  highScoreString = 'Nullstill poengliste';
  highScoreBool = false;
  errorMsg = 'En tilkoblingsfeil har oppstådd!';
  secondMsg = 'Er du helt sikker?';
  pairID = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private _snackBar: MatSnackBar,
    private _dialog: InfoDialogComponent,
    private pairing: PairingService
  ) {}

  revertDataset() {
    let msg = '';
    if (this.datasetBool) {
      this.resetDatasetValues();
      this.loginService.revertDataset().subscribe(
        () => {
          this.openSnackBar('Suksess! treningssett tilbakestilles (dette kan ta noen minutter)');
        },
        () => {
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
        () => {
          this.openSnackBar('Suksess! Modellen blir trent (dette kan ta noen minutter)');
        },
        () => {
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
        () => {
          this.openSnackBar('Suksess! Poengliste nullstilles (dette kan ta noen minutter)');
        },
        () => {
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
      () => {
        this.router.navigate(['admin']);
        this.openSnackBar('Du er logget ut!');
      },
      () => {
        this.router.navigate(['admin']);
        this.openSnackBar(this.errorMsg);
      }
    );
  }

  getInformation() {
    this.resetAll();
    this.loginService.getStatus().subscribe(
      (res: StatusData) => {
        const name = res.CV_iteration_name;
        const time = res.CV_time_created;
        const count = res.BLOB_image_count;
        this._dialog.openDialog(name, time, count.toString());
      },
      () => {
        this.openSnackBar(this.errorMsg);
      }
    );
  }

  openSnackBar(msg = 'suksess!') {
    this._snackBar.open(msg, 'Lukk', {
      duration: 6000,
    });
  }

  pair(id: string) {
    this.pairing.setPairID(id);
  }

  getPairID() {
    return this.pairing.getPairID();
  }
}
