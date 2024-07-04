import { environment } from '@/environments/environment';

export const routes = {
  LANDING: '',
  SINGLEPLAYER: 'playgame/singleplayer',
  MULTIPLAYER: 'playgame/multiplayer',
  RESULT: 'result',
  TEKNISKBACKEND: environment.TEKNISKBACKEND_ENDPOINT,
  DRAWING: 'drawing',
};
