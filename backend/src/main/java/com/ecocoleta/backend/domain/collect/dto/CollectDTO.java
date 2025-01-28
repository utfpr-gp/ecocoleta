package com.ecocoleta.backend.domain.collect.dto;

import com.ecocoleta.backend.domain.collect.CollectMaterials;
import com.ecocoleta.backend.domain.collect.CollectStatus;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;


public record CollectDTO(
        long id,
        Integer amount,
        boolean isEvaluated,
        Integer rating,
        CollectStatus status,
        LocalDateTime initTime,
        LocalDateTime endTime,
        LocalDateTime createTime,
        LocalDateTime updateTime,
        @NotNull
        @JsonAlias({"addressId", "address_id"})
        Long address,
        @NotNull
        @JsonAlias({"residentId", "resident_id"})
        Long resident,
        @JsonAlias({"id_waste_collector", "id", "waste_collector_id", "wasteCollectorId"})
        Long wasteCollector,
//        @Size(min = 1, message = "A coleta deve conter pelo menos um material")
        List<CollectMaterials> materials // Lista de materiais baseada no enum
) {
}