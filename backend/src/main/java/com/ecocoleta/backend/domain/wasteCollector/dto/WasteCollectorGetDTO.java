package com.ecocoleta.backend.domain.wasteCollector.dto;

import com.ecocoleta.backend.domain.user.UserRole;

import java.time.LocalDateTime;

public record WasteCollectorGetDTO(
        Long id,
        String name,
        String email,
        String phone,
        UserRole role,
        LocalDateTime createTime,
        LocalDateTime updateTime,
//        AddressDTO address, // Caso haja um endereço associado
        String cpf,
        Float score,
        String picture
) {
}
