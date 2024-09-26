package com.ecocoleta.backend.domain.collect.dto;

import jakarta.validation.constraints.NotNull;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;

public record CollectAddressAvaibleDTO(
        @NotNull
        long id,
        boolean isIntern,
        LocalDateTime schedule,
        String picture,
        Integer amount,
        @NotNull
        String status,
        @NotNull
        LocalDateTime createTime,
        LocalDateTime updateTime,
        @NotNull
        Long address_id,
        @NotNull
        Long resident_id,
        Long waste_Collector_id,
        Double longitude,
        Double latitude,
        // TODO verificar como retornar o Point - Point location
        String location


) {
}