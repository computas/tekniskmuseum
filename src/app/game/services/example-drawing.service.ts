import { TranslationService } from '@/app/core/translation.service';
import { endpoints } from '@/app/shared/models/endpoints';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExampleDrawingService {
  baseUrl = endpoints.TEKNISKBACKEND;
  private exampleDrawings: string[] = [];

  constructor(private http: HttpClient, private translationService: TranslationService) {}

  getExampleDrawings(numberOfDrawings: number, label: string): Observable<string[]> {
    if (this.hasNorwegianLabel()) {
      label = this.getTranslatedLabel(label);
    }

    const body = '';
    return this.http.post<string[]>(
      `${this.baseUrl}/${endpoints.GETEXAMPLEDRAWINGS}?n=${numberOfDrawings}&label=${label}`,
      body
    );
  }

  private getTranslatedLabel(label: string): string {
    this.translationService.loadTranslations('EN');
    return this.translationService.getTranslation(label);
  }

  private hasNorwegianLabel(): boolean {
    return this.translationService.getCurrentLang() === 'NO';
  }
}
