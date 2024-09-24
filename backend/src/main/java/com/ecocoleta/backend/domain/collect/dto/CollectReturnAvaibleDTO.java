package com.ecocoleta.backend.domain.collect.dto;

import com.ecocoleta.backend.domain.collect.CollectStatus;
import jakarta.validation.constraints.NotNull;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;

public record CollectReturnAvaibleDTO(
        @NotNull
        long id,
        @NotNull
        boolean is_intern,
        LocalDateTime schedule,
        String picture,
        Integer amount,
        @NotNull
        CollectStatus status,
        @NotNull
        LocalDateTime create_time,
        @NotNull
        Long address_id,
        @NotNull
        Long resident_id,
        Long waste_Collector_id,
        Double longitude,
        Double latitude,
        Point location
) {
}