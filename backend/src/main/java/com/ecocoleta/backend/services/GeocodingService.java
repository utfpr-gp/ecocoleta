package com.ecocoleta.backend.services;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeocodingService {

    private final GeoApiContext geoApiContext;
    public GeocodingService(@Value("${google.api.key}") String apiKey) {
        this.geoApiContext = new GeoApiContext.Builder()
                .apiKey(apiKey)
                .build();
    }

    public GeocodingResult[] getCoordinates(String address) {
        try {
            return GeocodingApi.geocode(geoApiContext, address).await();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar coordenadas no Google Geocoding API", e);
        }
    }
}
