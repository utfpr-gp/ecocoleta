package com.ecocoleta.backend.domain.dto;

import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.validation.constraints.NotNull;

public record UserUpdateDTO(
        @NotNull
        Long id,
        String name,
        String lastName,
        String phone,
        UserRole role) {

}