import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ErrorLogDialogComponent } from '../error-dialog/error-dialog.component';
import { LogData } from '@/app/shared/models/backend-interfaces';
import { StatisticsComponent } from '../statistics/statistics.component';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
  standalone: true,
})
export class InfoDialogComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(iterName: string, time: string, imgCount: string) {
    this.dialog.open(DialogComponent, {
      data: {
        iterationName: iterName,
        timeCreated: time,
        imageCount: imgCount,
      },
    });
  }

  openErrorLog(logDataArray: LogData[]) {
    this.dialog.open(ErrorLogDialogComponent, {
      data: logDataArray,
    });
  }

  openStatistics() {
    this.dialog.open(StatisticsComponent, {
      data: String,
    });
  }
}
