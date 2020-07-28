import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultiplayerService } from '../services/multiplayer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  waitingForOtherPlayer = true;
  subscriptions = new Subscription();

  constructor(public multiPlayerService: MultiplayerService) {}

  ngOnInit(): void {
    this.subscriptions.add(this.multiPlayerService.joinGame().subscribe());
    this.subscriptions.add(
      this.multiPlayerService.stateInfo$.subscribe((obs) => {
        if (obs.ready) {
          this.waitingForOtherPlayer = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
