export interface Result {
  hasWon: boolean;
  imageData: string;
  word: string | undefined;
  gameState: string;
  guess: string;
  score: number;
}

export interface StartGamePlayerId {
  player_id: string;
}

export interface GameLabel {
  label: string;
}
