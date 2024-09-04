package com.ecocoleta.backend.domain.collect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CollectGetDTO(
        @NotNull
        Long idWasteCollector,
        @NotBlank
        Double currentLatitude,
        @NotBlank
        Double currentLongitude,
        @NotBlank
        String city
) {
}
