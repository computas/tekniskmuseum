import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToggleComponent } from '../toggle/toggle.component';
import { SelectMonthComponent } from '../select-month/select-month.component';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { LoginService } from '../login.service';
import { SelectYearComponent } from '../select-year/select-year.component';

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
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatButtonToggleModule,
        ToggleComponent,
        SelectYearComponent, 
        SelectMonthComponent
    ],
})

export class StatisticsComponent {
    scoreCount: number | null = null; 
    dataFetched = signal<boolean>(false);
    display_month: string = "";
    month: string = "";
    year: string = "";
    selected: string = "month";
    selectedYear: string = "";

    constructor(
        public dialogRef: MatDialogRef<StatisticsComponent>,
        private loginService: LoginService,
        @Inject(MAT_DIALOG_DATA) public data: string) { }

    confirmSelection() {
        if (this.selected === "month") {
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

    onMonthSelected(date: string[]) {
        this.month = date[0];
        this.display_month = date[1]
        this.year = date[2];
    }
}
