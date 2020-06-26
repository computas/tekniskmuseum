import { TestBed } from '@angular/core/testing';

import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
  let service: DrawingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
