import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PairingService {
  private pairID = '';

  constructor() {
    const id = localStorage.getItem('pairID');

    this.setPairID(id ?? environment.PAIR_ID ?? '');
  }

  getPairID() {
    return this.pairID;
  }

  setPairID(pairID: string) {
    this.pairID = pairID.substring(0, 32);
    localStorage.setItem('pairID', pairID);
  }
}
