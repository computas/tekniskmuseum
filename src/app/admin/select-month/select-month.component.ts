import { Component, EventEmitter, Inject, OnInit, Output, signal, ViewEncapsulation } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'select-month-component',
    templateUrl: './select-month.component.html',
    styleUrls: ['./select-month.component.scss'],
    providers: [
        provideMomentDateAdapter(MY_FORMATS),
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})

export class SelectMonthComponent implements OnInit {
    scoreCount: number | null = null; 
    date = new FormControl();
    dataFetched = signal<boolean>(false);
    display_month: string = "";
    month: string = "";
    year: string = "";
    selected: string = "month";
    selectedYear: string = "";

    @Output() valueSelected: EventEmitter<string[]> = new EventEmitter<string[]>(); 

    constructor(
        // public dialogRef: MatDialogRef<ScoreComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string) { }

    ngOnInit(): void {
        this.date.valueChanges.subscribe(selectedDate => {
            this.handleDateChange();
        })
    }
    
    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value ?? moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date.setValue(ctrlValue);

        datepicker.close();
    }

    handleDateChange() {
        const ctrlValue = this.date.value;  
        this.month = ctrlValue.format("MM");  
        this.display_month = ctrlValue.format("MMMM");
        this.year = ctrlValue.format('YYYY');

        this.valueSelected.emit([this.month, this.display_month, this.year]);

        console.log(this.month, this.year)
    }

}