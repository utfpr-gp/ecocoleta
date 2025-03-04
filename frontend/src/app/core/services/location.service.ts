import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root', // Disponível globalmente
})
export class LocationService {
    private watchId: number | null = null;

    // TODO remover log
    // Obtém a localização atual do dispositivo
    getCurrentLocation(): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position),
                    (error) => {
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                alert('Permissão negada para acessar localização.');
                                break;
                            case error.POSITION_UNAVAILABLE:
                                alert('Informações de localização não estão disponíveis.');
                                break;
                            case error.TIMEOUT:
                                alert('O pedido de localização expirou.');
                                break;
                            default:
                                alert('Ocorreu um erro desconhecido.');
                        }
                        reject(error);
                    },
                    {enableHighAccuracy: true}
                );
            } else {
                reject('Geolocalização não é suportada neste dispositivo.');
                alert('Geolocalização não é suportada neste navegador.');
            }
        });
    }

    // Monitora a localização continuamente
    watchLocation(
        onLocationUpdate: (position: GeolocationPosition) => void,
        onError?: (error: GeolocationPositionError) => void
    ): number | null {
        if (!navigator.geolocation) {
            throw new Error('Geolocation não é suportado neste dispositivo.');
        }

        if (this.watchId !== null) {
            console.warn('Monitoramento já está ativo.');
            return this.watchId; // Retorna o ID existente se já estiver monitorando
        }

        this.watchId = navigator.geolocation.watchPosition(
            (position) => onLocationUpdate(position),
            (error) => {
                if (onError) onError(error);
            },
            {enableHighAccuracy: true}
        );

        return this.watchId;
    }

    // Para o monitoramento da localização
    clearWatch(): void {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            console.log('Monitoramento de localização parado.');
            this.watchId = null;
        } else {
            console.warn('Nenhum monitoramento ativo para parar.');
        }
    }
}
