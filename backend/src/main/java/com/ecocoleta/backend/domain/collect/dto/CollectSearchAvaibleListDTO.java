package com.ecocoleta.backend.domain.collect.dto;

import jakarta.validation.constraints.NotNull;

public record CollectSearchAvaibleListDTO(
        @NotNull
        Long idWasteCollector,
        @NotNull(message = "Latitude não pode ser vazio")
        Double currentLatitude,
        @NotNull(message = "Longitude não pode ser vazio")
        Double currentLongitude
) {
}
