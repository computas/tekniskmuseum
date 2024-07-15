import { Component } from '@angular/core';
import { GameProgressBarComponent } from './game-progress-bar/game-progress-bar.component';
import { Router } from '@angular/router';
import { routes } from '@/app/shared/models/routes';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { GameStateService } from '../../services/game-state-service';

@Component({
  selector: 'app-game-intermediate-result-header',
  standalone: true,
  imports: [GameProgressBarComponent, TranslatePipe],
  templateUrl: './game-intermediate-result-header.component.html',
  styleUrl: './game-intermediate-result-header.component.scss',
})
export class GameIntermediateResultHeaderComponent {
  constructor(private router: Router, private gameStateService: GameStateService) {}

  goToHomePage() {
    this.gameStateService.clearState();
    this.router.navigate([routes.LANDING]);
  }
}
