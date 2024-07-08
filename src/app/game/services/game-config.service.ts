import { GameLevelConfig, ImageScoreConfig } from '@/app/shared/models/interfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameConfigService {
  private readonly _difficultyLevel = new BehaviorSubject<GameLevelConfig>({
    difficultyId: 1,
    rounds: 3,
    secondsPerRound: 30,
    timeToStartClassify: 23,
    defaultTimeBetweenClassify: 5,
    minimumTimeBetweenClassify: 3,
    minimumDrawnThreshold: 3000,
    pixelsPerClassify: 2000,
  }); // Easy mode as default
  difficultyLevel$ = this._difficultyLevel.asObservable();

  setDifficultyLevel(level: 'easy' | 'medium' | 'hard'): void {
    switch (level) {
      case 'easy':
        this._setConfig = {
          difficultyId: 1,
          rounds: 3,
          secondsPerRound: 30,
          timeToStartClassify: 25,
          defaultTimeBetweenClassify: 5,
          minimumTimeBetweenClassify: 3,
          minimumDrawnThreshold: 3000,
          pixelsPerClassify: 2000,
        };
        break;
      case 'medium':
        this._setConfig = {
          difficultyId: 2,
          rounds: 3,
          secondsPerRound: 20,
          timeToStartClassify: 16,
          defaultTimeBetweenClassify: 4,
          minimumTimeBetweenClassify: 2,
          minimumDrawnThreshold: 3500,
          pixelsPerClassify: 2000,
        };
        break;
      case 'hard':
        this._setConfig = {
          difficultyId: 3,
          rounds: 3,
          secondsPerRound: 20,
          timeToStartClassify: 16,
          defaultTimeBetweenClassify: 4,
          minimumTimeBetweenClassify: 2,
          minimumDrawnThreshold: 3500,
          pixelsPerClassify: 2000,
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
      scoreDecrement: 1.67336683417,
    };
  }
}
