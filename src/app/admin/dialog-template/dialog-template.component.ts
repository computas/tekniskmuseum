import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  iterationName: string;
  timeCreated: string;
  imageCount: string;
}

@Component({
  selector: 'app-dialog-template',
  templateUrl: './dialog-template.component.html',
  styleUrls: ['./dialog-template.component.scss'],
})
export class DialogTemplateComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
