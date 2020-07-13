import { Result } from '../../../shared/models/result.interface';

export const ResultsMock: Result[] = [
  {
    hasWon: true,
    imageData:
      'data:image/png;base64,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',
    word: 'square',
    gameState: 'Done',
    guess: 'square',
  },
  {
    hasWon: false,
    imageData:
      'data:image/png;base64,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',
    word: 'bench',
    gameState: 'Done',
    guess: 'square',
  },
  {
    hasWon: true,
    imageData:
      'data:image/png;base64,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',
    word: 'star',
    gameState: 'Done',
    guess: 'square',
  },
  {
    hasWon: true,
    imageData:
      'data:image/png;base64,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',
    word: 'car',
    gameState: 'Done',
    guess: 'square',
  },
  {
    hasWon: false,
    imageData:
      'data:image/png;base64,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',
    word: 'banana',
    gameState: 'Done',
    guess: 'square',
  },
];