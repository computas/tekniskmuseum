import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameLevelConfig {
  difficultyId: number,
  rounds: number,
  secondsPerRound: number,
  timeToStartClassify: number
}
export interface ImageScoreConfig {
  maxScore: number,
  scoreDecrement: number
}

@Injectable({
  providedIn: 'root',
})
export class GameConfigService {
  private readonly _difficultyLevel = new BehaviorSubject<GameLevelConfig>({
    difficultyId: 1,
    rounds: 3,
    secondsPerRound: 30,
    timeToStartClassify: 23
  }); // Easy mode as default
  difficultyLevel$ = this._difficultyLevel.asObservable();
  
  
  setDifficultyLevel(level: 'easy' | 'medium' | 'hard'): void {
    switch (level) {
      case 'easy':
        this._setConfig = { 
          difficultyId: 1, 
          rounds: 3, 
          secondsPerRound: 30, 
          timeToStartClassify: 25
        };
        break;
      case 'medium':
        this._setConfig = { 
          difficultyId: 2, 
          rounds: 3, 
          secondsPerRound: 20, 
          timeToStartClassify: 15
        };
        break;
      case 'hard':
        this._setConfig = { 
          difficultyId: 3, 
          rounds: 3, 
          secondsPerRound: 20, 
          timeToStartClassify: 15
        }; 
        break;
    }
  }

  set _setConfig(newConfigValues: GameLevelConfig) {
    this._difficultyLevel.next(newConfigValues); 
  }

  get getConfig(): GameLevelConfig {
    return this._difficultyLevel.value;
  }

  getScoreSettings(): ImageScoreConfig {
    return {
      maxScore: 333,
      scoreDecrement: 1.67336683417
    }
  }
}
