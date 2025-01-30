package com.ecocoleta.backend.domain.user.dto;

import com.ecocoleta.backend.domain.user.UserRole;

/**
 * DTO para representar a contagem de usuários por tipo.
 *
 * @param role  Tipo de usuário (Resident, WasteCollector, Company).
 * @param count Quantidade de usuários desse tipo.
 */
public record UserTypeCountDTO(
        UserRole role,
        Long count
) {
}
