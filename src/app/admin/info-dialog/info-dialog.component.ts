import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogTemplateComponent } from './../dialog-template/dialog-template.component';
import { ErrorLogDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
  standalone: true,
})
export class InfoDialogComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(iterName: string, time: string, imgCount: string) {
    this.dialog.open(DialogTemplateComponent, {
      data: {
        iterationName: iterName,
        timeCreated: time,
        imageCount: imgCount,
      },
    });
  }

  openErrorLog(recordedTime: string, logName: string, msg: string) {
    console.log(logName)
    this.dialog.open(ErrorLogDialogComponent, {
      data: {
        time: recordedTime,
        name: logName,
        message: msg
      },
    });
  }
}
