import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToggleComponent } from '../toggle/toggle.component';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginService } from '../login.service';
import { SelectComponent } from '../select/select.component';

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
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss'],
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
        MatButtonToggleModule,
        ToggleComponent,
        SelectComponent
    ],
})

export class ScoreComponent {
    scoreCount: number | null = null; 
    date = new FormControl();
    dataFetched = signal<boolean>(false);
    display_month: string = "";
    month: string = "";
    year: string = "";
    selected: string = "month";
    selectedYear: string = "";

    constructor(
        public dialogRef: MatDialogRef<ScoreComponent>,
        private loginService: LoginService,
        @Inject(MAT_DIALOG_DATA) public data: string) { }


    setMonthAndYear2(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value ?? moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date.setValue(ctrlValue);

        datepicker.close();
    }

    confirmSelection() {
        if (this.selected === "month") {
            const ctrlValue = this.date.value;  
            this.month = ctrlValue.format("MM");  
            this.display_month = ctrlValue.format("MMMM");
            this.year = ctrlValue.format('YYYY');  

            this.loginService.getStatisticsPerMonth(this.month, this.year).subscribe({
                next: (res) => {
                    this.dataFetched.set(true);
                    this.scoreCount = res;
            
                },
                error: (err) => {
                console.error('Failed to fetch statistics', err);
                }
            });
        } else {
            this.loginService.getStatisticsPerYear(this.selectedYear).subscribe({
                next: (res) => {
                    this.dataFetched.set(true);
                    this.scoreCount = res;
            
                },
                error: (err) => {
                console.error('Failed to fetch statistics', err);
                }
            });
        }
      }

    closeStatistics(): void {
        this.dialogRef.close();
    }

    onToggleChanged(value: string) {
        this.selected = value;
        this.dataFetched.set(false);

      }

    onYearSelected(year: string) {
        this.selectedYear = year;
    }
    

}
