import { ExampleDrawingsData } from '@/app/shared/models/backend-interfaces';
import { endpoints } from '@/app/shared/models/endpoints';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SupportedLanguages } from '@/app/shared/models/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExampleDrawingService {
  private readonly baseUrl = endpoints.TEKNISKBACKEND;
  private exampleDrawings: string[] = [];

  constructor(private http: HttpClient) {}

  getExampleDrawingsFromLabel(numberOfImages: number, label: string, lang: SupportedLanguages): Observable<string[]> {
    const body: ExampleDrawingsData = {
      game_id: '',
      number_of_images: numberOfImages,
      label: label,
      lang: lang,
    };

    return this.http.post<string[]>(`${this.baseUrl}/${endpoints.GETEXAMPLEDRAWINGS}`, body);
  }

  preLoadExampleDrawings(numberOfImages: number, label: string, lang: SupportedLanguages) {
    const body: ExampleDrawingsData = {
      game_id: '',
      number_of_images: numberOfImages,
      label: label,
      lang: lang,
    };

    this.http.post<string[]>(`${this.baseUrl}/${endpoints.GETEXAMPLEDRAWINGS}`, body).subscribe((res) => {
      this.exampleDrawings = res;
    });
  }

  getExampleDrawings(numberOfDrawings: number): string[] {
    if (numberOfDrawings >= this.exampleDrawings.length) {
      return this.exampleDrawings;
    }
    return this.exampleDrawings.slice(0, numberOfDrawings);
  }
}
