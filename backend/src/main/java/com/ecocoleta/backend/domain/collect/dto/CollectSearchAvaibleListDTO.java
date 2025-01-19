package com.ecocoleta.backend.domain.collect.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;

public record CollectSearchAvaibleListDTO(
        @JsonAlias({"id_waste_collector", "id"})
        Long idWasteCollector,
        @NotNull(message = "Latitude não pode ser vazio")
        @JsonAlias({"latitude"})
        Double currentLatitude,
        @NotNull(message = "Longitude não pode ser vazio")
        @JsonAlias({"longitude"})
        Double currentLongitude
) {
}
