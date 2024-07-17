import { ExampleDrawingsData } from '@/app/shared/models/backend-interfaces';
import { endpoints } from '@/app/shared/models/endpoints';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameStateService } from './game-state-service';
import { MultiplayerService } from './multiplayer.service';
import { SupportedLanguages } from '@/app/shared/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ExampleDrawingService {
  private readonly baseUrl = endpoints.TEKNISKBACKEND;
  private exampleDrawings: string[] = [];

  constructor(private http: HttpClient) {}

  preLoadExampleDrawings(numberOfImages: number, label: string, lang: SupportedLanguages) {
    const body: ExampleDrawingsData = {
      game_id: '',
      number_of_images: numberOfImages,
      label: label,
      lang: lang,
    };

    this.http.post<string[]>(`${this.baseUrl}/${endpoints.GETEXAMPLEDRAWINGS}`, body).subscribe((res) => {
      console.log('uploaded example drawings');
      this.exampleDrawings = res;
    });
  }

  getExampleDrawings(): string[] {
    return this.exampleDrawings;
  }
}
