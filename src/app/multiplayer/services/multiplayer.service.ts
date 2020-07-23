import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { BehaviorSubject } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

export enum GAMELEVEL {
  lobby = 'LOBBY',
  drawing = 'DRAWING',
  intermediateResult = 'INTERMEDIATERESULT',
  waitingForWord = 'WAITINGFORWORD',
  howToPlay = 'HOWTOPLAY',
}
export interface GameState {
  player_nr: string | undefined;
  player_id: string | undefined;
  game_id: string | undefined;
  ready: boolean | undefined;
  gameLevel: GAMELEVEL | undefined;
  guessUsed: number | undefined;
}
export interface StateInfo {
  ready: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class MultiplayerService {
  public loading = true;
  public label = '';
  public isMultiplayer = false;
  score = 100;
  name = 'Ole';
  private initialState: GameState = {
    player_nr: undefined,
    gameLevel: GAMELEVEL.lobby,
    game_id: undefined,
    player_id: undefined,
    guessUsed: 0,
    ready: false,
  };

  private readonly _stateInfo = new BehaviorSubject<GameState>(this.initialState);

  readonly stateInfo$ = this._stateInfo.asObservable();

  constructor(private webSocketService: WebSocketService) {}

  joinGame() {
    this.webSocketService.emit('joinGame', '');
    this.webSocketService.listen('joinGame').subscribe((data: any) => {
      const el: GameState = JSON.parse(data);
      if (el && el.game_id) {
        this.stateInfo = el;
        console.log(el);
      }
      if (el.ready) {
        this.stateInfo = { ...this.stateInfo, ready: el.ready, gameLevel: GAMELEVEL.howToPlay };
      }
    });
  }

  getLabel(emit = true) {
    if (emit) {
      this.webSocketService.emit('getLabel', JSON.stringify({ game_id: this.stateInfo.game_id }));
    }
    return this.webSocketService.listen('getLabel').pipe(
      take(1),
      map((res: any) => {
        const data = JSON.parse(res);
        this.label = data.label;
        return this.label;
      })
    );
  }

  classify(data, image) {
    this.webSocketService.emit('classify', data, image);
  }

  predictionListener() {
    return this.webSocketService.listen('prediction');
  }

  roundOverListener() {
    return this.webSocketService.listen('round_over');
  }

  endGame() {
    this.webSocketService.emit(
      'endGame',
      JSON.stringify({
        game_id: this.stateInfo.game_id,
        score: this.score,
        player_id: this.stateInfo.player_id,
        name: this.name,
      })
    );
  }

  get stateInfo(): GameState {
    return this._stateInfo.getValue();
  }

  set stateInfo(val: GameState) {
    this._stateInfo.next(val);
  }
}
