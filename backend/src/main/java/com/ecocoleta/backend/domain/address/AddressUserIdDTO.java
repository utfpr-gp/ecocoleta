package com.ecocoleta.backend.domain.address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AddressUserIdDTO(
        @NotBlank
        Long userId,
        @NotBlank
        String city,
        @NotBlank
        String street,
        @NotBlank
        String number,
        @NotBlank
        String neighborhood,
        @NotBlank
        @Pattern(regexp = "\\d{8}")
        String cep
) {
}
