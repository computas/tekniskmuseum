import { environment } from '@/environments/environment';

export const endpoints = {
  TEKNISKBACKEND: environment.TEKNISKBACKEND_ENDPOINT,
  POSTSCORE: 'postScore',
  HIGHSCORE: 'viewHighScore',
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
  GETEXAMPLEDRAWINGS: 'getExampleDrawings',
  LOGGER: 'logging',
  GETSTATISTICSMONTH: 'getStatisticsPerMonth',
  GETSTATISTICSYEAR: 'getStatisticsPerYear',
  GETYEARS: 'getAvailableYears'
};
