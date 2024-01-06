package com.ecocoleta.backend.domain.resident;


import com.ecocoleta.backend.domain.adrress.AdrressDTO;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record ResidentDTO(
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
        @Valid
        AdrressDTO address
) {
}
