import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToggleComponent } from '../toggle/toggle.component';
import { SelectMonthComponent } from '../select-month/select-month.component';
import { GraphComponent } from '../graph/graph.component';
// import * as _moment from 'moment';
// import { default as _rollupMoment } from 'moment';
import { LoginService } from '../login.service';
import { SelectYearComponent } from '../select-year/select-year.component';


@Component({
    selector: 'app-score',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss'],
    standalone: true,
    imports: [
        MatButtonToggleModule,
        ToggleComponent,
        SelectYearComponent, 
        SelectMonthComponent,
        GraphComponent,
        MatDialogModule
    ],
})

export class StatisticsComponent implements OnDestroy {
    scoreCount: number | null = null; 
    dataFetched = signal<boolean>(false);
    display_month = "";
    month = "";
    year= "";
    selected = "month";
    selectedYear = "";
    errorMessage = "";

    constructor(
        public dialogRef: MatDialogRef<StatisticsComponent>,
        private loginService: LoginService,
        @Inject(MAT_DIALOG_DATA) public data: string) { }
    

        confirmSelection() {
            this.errorMessage = ""; // Reset error message
            
            if (this.selected === "month" && this.month !== "") {
                this.loginService.getStatisticsPerMonth(this.month, this.year).subscribe({
                    next: (res) => {
                        this.dataFetched.set(true);
                        this.scoreCount = res;
                        this.month = "";    
                        this.year = "";
                    },
                    error: (err) => {
                        console.error('Failed to fetch statistics', err);
                    }
                });

            } else if (this.selected  === "year" && this.selectedYear !== "") {
                this.loginService.getStatisticsPerYear(this.selectedYear).subscribe({
                    next: (res) => {
                        this.dataFetched.set(true);
                        this.scoreCount = res;
                        },
                    error: (err) => {
                        console.error('Failed to fetch statistics', err);
                    }
                }); 
            } else {
                if (this.selected === "month") {
                    this.errorMessage = "Vennligst velg en dato";
                } else if (this.selected === "year") {
                    this.errorMessage = "Vennligst velg et år";
                }
            }
        }

    closeDialog(): void {
        this.dialogRef.close();
    }

    onToggleChanged(value: string) {
        this.selected = value;
        this.dataFetched.set(false);
        this.errorMessage = "";
      }

    onYearSelected(year: string) {
        this.selectedYear = year;
    }

    onMonthSelected(date: string[]) {
        this.dataFetched.set(false);
        this.month = date[0];
        this.display_month = date[1]
        this.year = date[2];
  }

    ngOnDestroy(): void {
        this.dialogRef.close();
    }
    
}
