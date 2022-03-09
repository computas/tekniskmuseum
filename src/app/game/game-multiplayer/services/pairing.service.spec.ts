import { TestBed } from '@angular/core/testing';

import { PairingService } from './pairing.service';

describe('WebSocketService', () => {
  let service: PairingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PairingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set an id', () => {
    const currentID = service.getPairID();
    service.setPairID(`${currentID}-test`);
    const newID = service.getPairID();
    expect(newID).toBe(`${currentID}-test`);
  });

});
