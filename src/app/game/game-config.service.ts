import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameConfig {
  difficultyId: number;
  rounds: number;
  secondsPerRound: number;
  timeToStartClassify: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameConfigService {
  private _configValues: GameConfig = {
    difficultyId: 1,
    rounds: 3,
    secondsPerRound: 30,
    timeToStartClassify: 23,
  };

  private readonly _config = new BehaviorSubject<GameConfig>(this._configValues); // Easy mode as default
  config$ = this._config.asObservable();

  setDifficultyLevel(level: string): void {
    switch (level) {
      case 'easy':
        this.setConfig = {
          difficultyId: 1,
          rounds: 3,
          secondsPerRound: 30,
          timeToStartClassify: 25,
        };
        break;
      case 'medium':
        this.setConfig = {
          difficultyId: 2,
          rounds: 3,
          secondsPerRound: 20,
          timeToStartClassify: 15,
        };
        break;
      case 'hard':
        this.setConfig = {
          difficultyId: 3,
          rounds: 3,
          secondsPerRound: 20,
          timeToStartClassify: 15,
        };
        break;
    }
  }

  set setConfig(newConfigValues: GameConfig) {
    this._configValues = { ...this._configValues, ...newConfigValues };
    this._config.next(newConfigValues);
  }

  get getConfig(): GameConfig {
    return this._configValues;
  }
}
