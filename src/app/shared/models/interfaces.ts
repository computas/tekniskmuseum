export interface Result {
  hasWon: boolean;
  imageData: string;
  word: string | undefined;
  gameState: string;
  guess: string;
  score: number;
  serverRound: number;
  roundIsDone: boolean;
}

export enum GAMESTATE {
  lobby = 'LOBBY',
  drawing = 'DRAWING',
  intermediateResult = 'INTERMEDIATERESULT',
  waitingForWord = 'WAITINGFORWORD',
  howToPlay = 'HOWTOPLAY',
  showResult = 'SHOWRESULT',
  showWord = 'SHOWWORD',
}

export interface GameState {
  player_nr: string | undefined;
  player_id: string | undefined;
  game_id: string | undefined;
  ready: boolean | undefined;
  gameState: GAMESTATE | undefined;
  guessUsed: number | undefined;
  score: number | undefined;
  label: string | undefined;
}
export interface StateInfo {
  ready: boolean;
}

export interface DialogData {
  iterationName: string;
  timeCreated: string;
  imageCount: string;
}

export interface PlayerDisconnectedData {
  player_disconnected: boolean | undefined;
}

export interface PlayerScore {
  playerId: string;
  score: number;
}

export type SupportedLanguages = 'NO' | 'EN';

export interface Certainty {
  label: string;
  certainty: number;
}
