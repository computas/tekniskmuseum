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
export interface Certainty {
  label: string;
  certainty: number;
}

export interface PredictionData {
  certainty: Certainty[];
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
