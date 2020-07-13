import { TestBed } from '@angular/core/testing';

import { HighScoreService } from './highscore.service';
import { SpeechService } from './speech.service';
import { SpeechServiceMock } from './speech.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HighscoreService', () => {
  let service: HighScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SpeechService, useValue: SpeechServiceMock }],
    });
    service = TestBed.inject(HighScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
