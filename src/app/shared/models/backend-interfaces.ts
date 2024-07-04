export interface StartGamePlayerId {
  player_id: string;
}

export interface GameLabel {
  label: string;
}

interface Score {
  id: number;
  score: number;
}

export interface Highscore {
  daily: Score[];
  total: Score[];
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
