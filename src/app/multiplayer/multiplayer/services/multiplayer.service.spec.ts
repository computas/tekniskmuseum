import { TestBed } from '@angular/core/testing';

import { MultiplayerService } from './multiplayer.service';

describe('MultiplayerService', () => {
  let service: MultiplayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiplayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
