import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  imports: [MatButtonToggleModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class ToggleComponent implements OnInit {
  @Output() toggleChanged = new EventEmitter<string>(); 
  
  toggleControl = new FormControl('month');

  fontStyleControl = new FormControl('');
  
  ngOnInit(): void {
    this.toggleControl.valueChanges.subscribe((value) => {
      const safeValue = value ?? 'month';
      console.log('Toggle changed:', value); 
      this.toggleChanged.emit(safeValue); 

    });
  }
  
  }

