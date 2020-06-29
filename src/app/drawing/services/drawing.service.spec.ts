import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
  let service: DrawingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DrawingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
