import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
})
export class InfoDialogComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(DialogElementsComponent);
  }

  ngOnInit(): void {}
}

@Component({
  selector: 'app-info-example-dialog',
  templateUrl: 'info-dialog.component.html',
})
export class DialogElementsComponent {}
