import { Difficulty, SupportedLanguages } from './interfaces';

export interface StartGamePlayerId {
  player_id: string;
}

export interface GameLabel {
  label: string;
}

interface Highscore {
  id: number;
  score: number;
}

export interface HighscoreData {
  daily: Highscore[];
  total: Highscore[];
}

export interface Score {
  player_id: string;
  score: string;
  difficulty_id: Difficulty;
}

// export type Certainty = Record<string, number>;
export type Certainties = Record<string, number>;

export interface PredictionData {
  certainty: Certainties;
  guess: string;
  correctLabel: string;
  hasWon: boolean;
  gameState: string;
  serverRound: number;
}

export interface JoinGameData {
  player_nr: number;
  player_id: string;
  game_id: string;
}

export interface ExampleDrawingsData {
  game_id: string | undefined;
  number_of_images: number;
  label: string;
  lang: SupportedLanguages;
}

export interface JoinGameReady {
  ready: boolean;
}

export interface AuthStatus {
  success: string;
}

export interface StatusData {
  CV_iteration_name: string;
  CV_time_created: string;
  BLOB_image_count: number;
}

export interface MultiplayerClassifyParams {
  game_id?: string;
  time_left: number;
  lang: SupportedLanguages;
}

export interface LogData {
  date: string,
  time: string,
  level: string,
  message: string,
}
