import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  constructor(public dialog: MatDialog, public dialogExample: DialogComponent) {}

  openDialog(iterName: string, time: string, imgCount: string) {
    this.dialog.open(DialogComponent, {
      data: {
        iterationName: iterName,
        timeCreated: time,
        imageCount: imgCount,
      },
    });
  }
}

@Component({
  selector: 'app-info-dialog',
  templateUrl: 'app-info-dialog.html',
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
