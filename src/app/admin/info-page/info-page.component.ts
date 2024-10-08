import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { PairingService } from '../../game/services/pairing.service';
import { MatButton } from '@angular/material/button';
import { LogData, StatusData } from '@/app/shared/models/backend-interfaces';
import { LoggingService } from '../../game/services/logging.service';
import { GraphComponent } from '../graph/graph.component';

@Component({
  selector: 'app-info',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss'],
  standalone: true,
  imports: [MatButton, GraphComponent],
})
export class InfoPageComponent {
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
    private pairing: PairingService,
    private loggingService: LoggingService,
  ) {}
  
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
      this.setHighScoreValues();
    }
  }

  resetHighScoreValues() {
    this.highScoreString = 'Nullstill poengliste';
    this.highScoreBool = false;
  }

  resetDatasetValues() {
    this.datasetString = 'Nullstill treningssett til originalen';
    this.datasetBool = false;
  }

  setHighScoreValues() {
    this.highScoreString = this.secondMsg;
    this.highScoreBool = true;
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

  getStatistics() {
    this._dialog.openStatistics();
  }

  getLogger() {
    this.loginService.getLogger().subscribe(
      (res: LogData[]) => { 
        this._dialog.openErrorLog(res)
      },
      (error) => {
        this.openSnackBar(error);
      }
    );
  } 

  //Refactor when a generic format is defined
  getLoggerFrontend() {
    const frontend_logs = this.loggingService.get_logs()
    const formatted_logs: LogData[] = frontend_logs.map(str => ({
      date: str.slice(8,19),
      time: str.slice(24,30),
      level: str.slice(0,8),
      message: str.slice(80,115),
    }))
    
    this._dialog.openErrorLog(formatted_logs)
     
  } 

  openSnackBar(msg = 'suksess!') {
    this._snackBar.open(msg, 'Lukk', {
      duration: 6000,
    });
  }
}
