// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // WS_ENDPOINT: 'wss://tekniskback-mp.azurewebsites.net',
  WS_ENDPOINT: 'ws://localhost:5000',
  TEKNISKBACKEND_ENDPOINT: 'http://localhost:8000',
  inactivityTime: 15 * 1000, // 15 seconds
  // Maximum length of value is 32 characters
  PAIR_ID: 'local-1',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
