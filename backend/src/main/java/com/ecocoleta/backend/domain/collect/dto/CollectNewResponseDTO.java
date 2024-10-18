package com.ecocoleta.backend.domain.collect.dto;

import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.CollectStatus;

public record CollectNewResponseDTO(Long idCollect, Long idAddress, Long idResident, CollectStatus status) {

    public CollectNewResponseDTO(Collect collect) {
        this(collect.getId(), collect.getAddress().getId(), collect.getResident().getId(), collect.getStatus());
    }

}
