export interface Result {
  hasWon: boolean;
  imageData: string;
  word: string | undefined;
  gameState: string;
  guess: string;
  score: number;
  serverRound?: number;
}

export interface StartGamePlayerId {
  player_id: string;
}

export interface GameLabel {
  label: string;
}

type Score = {
  id: number;
  score: number;
}

export type Highscore = {
  daily: Score[];
  total: Score[];
}