package com.ecocoleta.backend.domain.collect.dto;

import com.ecocoleta.backend.domain.collect.CollectStatus;

public record CollectStatusCountDTO(
        CollectStatus status,
        Long count
) {
}
