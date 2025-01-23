// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    API_KEY_GOOGLE_MAPS: 'AIzaSyDd5qIPYn_mY69903Ye12Qn5dT3__illzk',
    // API: 'http://localhost:8080',
    API: 'https://10.0.2.2:8443',
    // API: 'https://localhost:8443',
//     TODO mudar para o ip do servidor ou local apos teste no emulador
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
