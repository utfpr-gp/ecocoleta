package com.ecocoleta.backend.domain.company.dto;

import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CompanyDTO(
        @NotBlank
        String name,
        @NotBlank
        String companyName,
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
        String cnpj,
        @Valid
        AddressDTO adrress
) {
}
