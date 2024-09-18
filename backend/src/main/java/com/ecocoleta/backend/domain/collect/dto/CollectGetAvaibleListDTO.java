package com.ecocoleta.backend.domain.collect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CollectGetAvaibleListDTO(
        @NotNull
        Long idWasteCollector,
        @NotNull(message = "Latitude não pode ser vazio")
        Double currentLatitude,
        @NotNull(message = "Longitude não pode ser vazio")
        Double currentLongitude,
        @NotBlank(message = "cidade não pode ser vazio")
        String city
) {
}
