import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

// Carregar o script do Google Maps antes de iniciar o Angular
const loadGoogleMaps = new Promise<void>((resolve, reject) => {
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Script já carregado
        resolve();
        return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.API_KEY_GOOGLE_MAPS}&libraries=places`;
    script.async = true;
    script.onload = () => resolve(); // Sucesso
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    document.head.appendChild(script);
});

// Inicializar o Angular somente após carregar o Google Maps
loadGoogleMaps
    .then(() => {
        console.log('Google Maps API carregada com sucesso!');
        return platformBrowserDynamic().bootstrapModule(AppModule);
    })
    .catch((err) => {
        console.error('Erro ao carregar o Google Maps API:', err);
    });
