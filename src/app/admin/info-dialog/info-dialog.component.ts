import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

/**
 * @title Dialog elements
 */
@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
})
export class InfoDialogComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(DialogExampleComponent);
  }
}

@Component({
  selector: 'app-info-dialog-example',
  templateUrl: 'app-info-dialog-example.html',
})
export class DialogExampleComponent {}
