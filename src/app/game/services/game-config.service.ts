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
    timeToStartClassify: 27,
    defaultTimeBetweenClassify: 3,
    minimumTimeBetweenClassify: 2,
    minimumDrawnThreshold: 500,
    pixelsPerClassify: 2000,
    intervalDuration: 100,
  }); // Easy mode as default
  difficultyLevel$ = this._difficultyLevel.asObservable();

  setDifficultyLevel(level: 'easy' | 'medium' | 'hard'): void {
    switch (level) {
      case 'easy':
        this._setConfig = {
          difficultyId: 1,
          rounds: 3,
          secondsPerRound: 1,
          timeToStartClassify: 27,
          defaultTimeBetweenClassify: 3,
          minimumTimeBetweenClassify: 2,
          minimumDrawnThreshold: 500,
          pixelsPerClassify: 2000,
          intervalDuration: 100,
        };
        break;
      case 'medium':
        this._setConfig = {
          difficultyId: 2,
          rounds: 3,
          secondsPerRound: 1,
          timeToStartClassify: 17,
          defaultTimeBetweenClassify: 3,
          minimumTimeBetweenClassify: 2,
          minimumDrawnThreshold: 500,
          pixelsPerClassify: 2000,
          intervalDuration: 100,
        };
        break;
      case 'hard':
        this._setConfig = {
          difficultyId: 3,
          rounds: 3,
          secondsPerRound: 1,
          timeToStartClassify: 17,
          defaultTimeBetweenClassify: 3,
          minimumTimeBetweenClassify: 2,
          minimumDrawnThreshold: 500,
          pixelsPerClassify: 2000,
          intervalDuration: 100,
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
    const maxScore = 333;
    const intervalDuration = this.getConfig.intervalDuration;
    return {
      maxScore: maxScore,
      scoreDecrement: maxScore / ((this.getConfig.secondsPerRound * 1000) / intervalDuration),
    };
  }
}
