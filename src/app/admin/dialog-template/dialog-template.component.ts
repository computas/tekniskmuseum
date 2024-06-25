import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';

export interface DialogData {
  iterationName: string;
  timeCreated: string;
  imageCount: string;
}

@Component({
    selector: 'app-dialog-template',
    templateUrl: './dialog-template.component.html',
    styleUrls: ['./dialog-template.component.scss'],
    standalone: true,
    imports: [
        CdkScrollable,
        MatDialogContent,
        MatDialogTitle,
    ],
})
export class DialogTemplateComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
