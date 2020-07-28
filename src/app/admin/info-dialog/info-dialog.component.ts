import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogTemplateComponent } from './../dialog-template/dialog-template.component';

export interface DialogData {
  iterationName: string;
  timeCreated: string;
  imageCount: string;
}

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
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
}
