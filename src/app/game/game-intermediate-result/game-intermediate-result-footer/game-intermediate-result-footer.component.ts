import { Component, Input, OnInit, output } from '@angular/core';
import { TranslatePipe } from '@/app/pipes/translation.pipe';
import { NEXTPAGE } from './next-page-identifier';

@Component({
  selector: 'app-game-intermediate-result-footer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './game-intermediate-result-footer.component.html',
  styleUrl: './game-intermediate-result-footer.component.scss',
})
export class GameIntermediateResultFooterComponent implements OnInit {
  @Input() gameOver: boolean = false;
  @Input() isMultiplayer: boolean = false;
  @Input() waitingForPlayer: boolean = true;
  onNextPageClick = output<NEXTPAGE>();
  buttonTextKey: string = '';
  nextPageIdentifier: NEXTPAGE | undefined;

  ngOnInit(): void {
    this.buttonTextKey = this.getButtonTextKey();
  }

  nextPage(): void {
    if (!this.nextPageIdentifier) return;
    this.onNextPageClick.emit(this.nextPageIdentifier);
  }

  getButtonTextKey(): string {
    if (this.isMultiplayer && this.waitingForPlayer) {
      return 'WAITING_FOR_PLAYER';
    }
    if (this.gameOver) {
      this.nextPageIdentifier = NEXTPAGE.showResult;
      return 'SUMMARY_BUTTON';
    }
    if (!this.gameOver) {
      this.nextPageIdentifier = NEXTPAGE.showWord;
      return 'NEXT_WORD_BUTTON';
    }
    return '';
  }
}
