package com.ecocoleta.backend.domain.collect.dto;

import jakarta.validation.constraints.NotNull;


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
        LocalDateTime createTime,
        LocalDateTime updateTime,
        @NotNull
        Long address_id,
        @NotNull
        Long resident_id,
        Long waste_Collector_id,
        Double longitude,
        Double latitude,
        //Pode ser retornado com o tipo Point - Point location, porém tem que ser feito a conversão de byte wkt para Point...
        String location
) {
}