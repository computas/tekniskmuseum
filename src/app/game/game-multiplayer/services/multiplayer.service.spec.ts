import { TestBed } from '@angular/core/testing';

import { MultiplayerService } from './multiplayer.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('MultiplayerService', () => {
  let service: MultiplayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    service = TestBed.inject(MultiplayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
