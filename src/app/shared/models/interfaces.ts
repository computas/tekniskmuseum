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
  homeScreen = 'HOMESCREEN',
  howToPlay = 'HOWTOPLAY',
  difficultyPicker = 'CHOOSEDIFFICULTY',
  drawingBoard = 'DRAWINGBOARD',
  drawing = 'DRAWING',
  intermediateResult = 'INTERMEDIATERESULT',
  waitingForWord = 'WAITINGFORWORD',
  showResult = 'SHOWRESULT',
  showWord = 'SHOWWORD',
}

export enum PLAYERNR {
  player1 = 'player_1',
  player2 = 'player_2',
}

export type Difficulty = 1 | 2 | 3 | 4; // 4 for multiplayer

export interface GameState {
  player_nr: PLAYERNR | undefined;
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

export enum PointerSide {
  Top = 'ptop',
  Right = 'pright',
  Bottom = 'pbottom',
  Left = 'pleft',
  NotAssigned = '',
}

export enum ArrowAlignment {
  Center = 'acenter',
  Left = 'aleft',
  Right = 'aright',
  Top = 'atop',
  Bottom = 'abottom',
  NotAssigned = '',
}

export interface GameLevelConfig {
  difficultyId: Difficulty;
  rounds: number;
  secondsPerRound: number;
  timeToStartClassify: number;
  defaultTimeBetweenClassify: number;
  minimumTimeBetweenClassify: number;
  minimumDrawnThreshold: number;
  pixelsPerClassify: number;
  intervalDuration: number; // How often to decrement score
}
export interface ImageScoreConfig {
  maxScore: number;
  scoreDecrement: number;
}
