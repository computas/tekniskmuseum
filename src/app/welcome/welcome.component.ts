import { Component, OnInit } from '@angular/core';
import { MultiplayerService } from '../game/game-multiplayer/services/multiplayer.service';
import { DrawingService } from '../game/game-draw/services/drawing.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        MatButton,
        MatIcon,
    ],
})
export class WelcomeComponent implements OnInit {
  private headerClicks = 0;
  constructor(
    private multiplayerService: MultiplayerService,
    private drawingService: DrawingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.multiplayerService.clearState();
    this.drawingService.clearState();
  }

  goToAdmin() {
    this.headerClicks++;
    if (this.headerClicks === 7) {
      this.headerClicks = 0;
      this.router.navigate(['admin/info']);
    }
  }
}
