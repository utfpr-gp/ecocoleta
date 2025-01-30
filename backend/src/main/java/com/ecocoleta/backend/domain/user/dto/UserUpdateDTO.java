package com.ecocoleta.backend.domain.user.dto;

import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserUpdateDTO(
        @NotNull
        Long id,
        @NotBlank String name,
        @NotBlank String phone,
        String email,
        UserRole role,
        String cpf,               // Específico para WasteCollector
        String cnpj,             // Específico para Company
        String companyName,            // Específico para Company
        String picture,                // Específico para WasteCollector
        Double latitude,               // Específico para localização
        Double longitude) {

}