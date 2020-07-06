import { TestBed } from '@angular/core/testing';

import { HighscoreService } from './highscore.service';

describe('HighscoreService', () => {
  let service: HighscoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighscoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
