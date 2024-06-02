package com.ecocoleta.backend.domain.material;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigInteger;

public record MaterialDTO(
        Long id,
        @NotBlank
        String name,
        @NotNull
        BigInteger score) {

        public MaterialDTO(Material material) {
                this(material.getId(), material.getName(), material.getScore());
        }
}
