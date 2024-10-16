import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { endpoints } from '../../shared/models/endpoints';
import { Observable } from 'rxjs';

interface Year {
    value: string;
}

/**
 * @title Basic select
 */
@Component({
    selector: 'app-select-year-component',
    templateUrl: 'select-year.component.html',
    standalone: true,
    imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
})
export class SelectYearComponent implements OnInit {
    constructor(private http: HttpClient) {}
    years: Year[] = [];
    selectedValue = "";

    @Output() valueSelected: EventEmitter<string> = new EventEmitter<string>(); 

    ngOnInit(): void {
        this.getAvailableYears().subscribe({
            next: (yearList) => {
                this.years = yearList.map(year => ({
                    value: year.toString()
                }));
            },
            error: (err) => {
                console.error('Failed to get available years', err);
                }
        });
    }

    onSelectionChange() {
        this.valueSelected.emit(this.selectedValue);
    }

    getAvailableYears(): Observable<number[]> {
        return this.http.get<number[]>(
            `${endpoints.TEKNISKBACKEND}/${endpoints.GETYEARS}`,
            {}
                
          );
      }

    
}
