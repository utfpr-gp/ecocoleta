package com.ecocoleta.backend.domain.resident;


import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

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
        LocalDateTime createTime,
        LocalDateTime updateTime,
        @Valid
        AddressDTO address
) {
}
