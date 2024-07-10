import { TranslationService } from '@/app/core/translation.service';
import { endpoints } from '@/app/shared/models/endpoints';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExampleDrawingService {
  baseUrl = endpoints.TEKNISKBACKEND;
  private exampleDrawings: string[] = [];

  constructor(private http: HttpClient, private translationService: TranslationService) {}

  getExampleDrawings(numberOfDrawings: number, label: string) {
    if (this.hasNorwegianLabel()) {
      label = this.getTranslatedLabel(label);
    }

    const body = '';
    this.http
      .post<string[]>(`${this.baseUrl}/${endpoints.GETEXAMPLEDRAWINGS}/?n=${numberOfDrawings}&label=${label}`, body, {
        observe: 'response',
      })
      .subscribe((res) => {
        console.log('Response body: ' + res.body);
      });

    return;
  }

  private getTranslatedLabel(label: string): string {
    this.translationService.loadTranslations('EN');
    return this.translationService.getTranslation(label);
  }

  private hasNorwegianLabel(): boolean {
    return this.translationService.getCurrentLang() === 'NO';
  }
}
