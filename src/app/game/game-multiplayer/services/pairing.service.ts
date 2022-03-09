import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PairingService {
    private pairID: string;

    constructor() {
      const id = localStorage.getItem('pairID');
      id ? this.pairID = id : this.pairID = environment.PAIR_ID;
    }

    getPairID() {
      return this.pairID;
    }

    setPairID(pairID: string) {
      this.pairID = pairID;
      localStorage.setItem('pairID', pairID);
    }
}
