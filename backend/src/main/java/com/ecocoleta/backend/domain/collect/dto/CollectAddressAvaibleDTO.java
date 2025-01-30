package com.ecocoleta.backend.domain.collect.dto;

import com.ecocoleta.backend.domain.collect.CollectMaterials;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;


import java.time.LocalDateTime;
import java.util.List;

public record CollectAddressAvaibleDTO(
        @NotNull
        long id,
        Integer amount,
        @NotNull
        String status,
        LocalDateTime initTime,
        LocalDateTime endTime,
        LocalDateTime createTime,
        LocalDateTime updateTime,
        @NotNull
        @JsonAlias({"addressId", "address_id"})
        Long addressId,
        @NotNull
        @JsonAlias({"residentId", "resident_id"})
        Long residentId,
        @JsonAlias({"id_waste_collector", "id", "waste_collector_id", "wasteCollectorId"})
        Long wasteCollectorId,
        Double longitude,
        Double latitude,
        //Pode ser retornado com o tipo Point - Point location, porém tem que ser feito a conversão de byte wkt para Point...
        String location,
        List<CollectMaterials> materials
) {
}