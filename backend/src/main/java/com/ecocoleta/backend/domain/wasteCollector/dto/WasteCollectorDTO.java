package com.ecocoleta.backend.domain.wasteCollector.dto;

import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record WasteCollectorDTO(
        @NotBlank
        String name,
        @NotBlank
        @Email
        String email,
        @NotBlank
        @Pattern(regexp = "\\d{4,255}")
        String password,
        @NotBlank
        String phone,
        @NotNull
        UserRole role,
        @NotBlank
        String cpf,
        @NotBlank
        String picture,
        @Valid
        AddressDTO adrress
) {
}
