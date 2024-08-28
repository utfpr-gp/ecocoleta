package com.ecocoleta.backend.domain.material;

import jakarta.validation.constraints.NotNull;

public record MaterialIdDTO(
        @NotNull
        Long id) {
}
