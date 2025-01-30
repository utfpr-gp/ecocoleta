package com.ecocoleta.backend.domain.resident.dto;

import com.ecocoleta.backend.domain.user.UserRole;

import java.time.LocalDateTime;

public record ResidentGetDTO(
        Long id,
        String name,
        String email,
        String phone,
        UserRole role,
        LocalDateTime createTime,
        LocalDateTime updateTime
//        AddressDTO address
) {
}
