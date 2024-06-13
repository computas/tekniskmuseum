import { environment } from '@/environments/environment';

export const endpoints = {
  TEKNISKBACKEND: environment.TEKNISKBACKEND_ENDPOINT,
  ENDGAME: 'endGame',
  CLASSIFY: 'classify',
  GETLABEL: 'getLabel',
  STARTGAME: 'startGame',
  AUTH: 'auth',
  ADMIN: 'admin',
  DROPTABLE: 'clearHighScore',
  TRAINML: 'trainML',
  CLEARTRAINSET: 'hardReset',
  PING: 'ping',
  GETSTATUS: 'status',
  LOGOUT: 'logout',
};
