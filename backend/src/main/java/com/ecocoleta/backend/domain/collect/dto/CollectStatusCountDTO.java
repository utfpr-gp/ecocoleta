package com.ecocoleta.backend.domain.collect.dto;

import com.ecocoleta.backend.domain.collect.CollectStatus;

/**
 * DTO para representar a contagem de coletas por status.
 *
 * @param status Status da coleta.
 * @param count  Quantidade de coletas com esse status.
 */
public record CollectStatusCountDTO(
        CollectStatus status,
        Long count
) {
}
