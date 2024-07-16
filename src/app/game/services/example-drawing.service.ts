import { ExampleDrawingsData } from '@/app/shared/models/backend-interfaces';
import { endpoints } from '@/app/shared/models/endpoints';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExampleDrawingService {
  baseUrl = endpoints.TEKNISKBACKEND;

  constructor(private http: HttpClient) {}

  getExampleDrawings(body: ExampleDrawingsData): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}/${endpoints.GETEXAMPLEDRAWINGS}`, body);
  }
}
