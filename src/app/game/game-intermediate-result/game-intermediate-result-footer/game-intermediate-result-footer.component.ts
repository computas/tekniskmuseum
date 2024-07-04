import { Component, Input, OnInit, output } from '@angular/core';
import { TranslatePipe } from '@/app/pipes/translation.pipe';
import { MatIcon } from '@angular/material/icon';
import { GAMESTATE } from '@/app/shared/models/interfaces';
@Component({
  selector: 'app-game-intermediate-result-footer',
  standalone: true,
  imports: [TranslatePipe, MatIcon],
  templateUrl: './game-intermediate-result-footer.component.html',
  styleUrl: './game-intermediate-result-footer.component.scss',
})
export class GameIntermediateResultFooterComponent implements OnInit {
  @Input() isGameOver = false;
  @Input() isMultiplayer = false;
  @Input() isWaitingForPlayer = true;
  onNextPageClick = output<GAMESTATE>();
  buttonTextKey = '';
  nextPageIdentifier: GAMESTATE | undefined;

  ngOnInit(): void {
    this.buttonTextKey = this.getButtonTextKey();
  }

  nextPage(): void {
    if (!this.nextPageIdentifier) return;
    this.onNextPageClick.emit(this.nextPageIdentifier);
  }

  getButtonTextKey(): string {
    if (this.isMultiplayer && this.isWaitingForPlayer) {
      return 'WAITING_FOR_PLAYER';
    }
    if (this.isGameOver) {
      this.nextPageIdentifier = GAMESTATE.showResult;
      return 'SUMMARY_BUTTON';
    }
    if (!this.isGameOver) {
      this.nextPageIdentifier = GAMESTATE.showWord;
      return 'NEXT_WORD_BUTTON';
    }
    return '';
  }
}
