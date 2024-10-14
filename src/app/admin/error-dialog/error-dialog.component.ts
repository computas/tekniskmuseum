import { LogData } from '@/app/shared/models/backend-interfaces';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-error-dialog',
  templateUrl: 'error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']}
)
export class ErrorLogDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LogData[]) {}

  logs = this.data

}
