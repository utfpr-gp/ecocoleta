package com.ecocoleta.backend.domain.company.dto;

import com.ecocoleta.backend.domain.user.UserRole;

import java.time.LocalDateTime;

public record CompanyGetDTO(
        Long id,
        String name,
        String email,
        String phone,
        UserRole role,
        LocalDateTime createTime,
        LocalDateTime updateTime,
        String cnpj,
        String companyName
) {
}
