package com.ecocoleta.backend.domain.collect.dto;

import com.ecocoleta.backend.domain.collect.CollectStatus;
import com.ecocoleta.backend.domain.material.MaterialIdDTO;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.List;

public record CollectDTO(
        long id,
        @NotNull
        @JsonAlias({"intern", "interno", "is_intern"})
        boolean isIntern,
        @Future
//        @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
        LocalDateTime schedule,
        String picture,
//        @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message = "O número deve ser entre 1 e 99")
        Integer amount,
        CollectStatus status,
        LocalDateTime initTime,
        LocalDateTime endTime,
        LocalDateTime createTime,
        LocalDateTime updateTime,
        @NotNull
        @JsonAlias({"id_address"})
        Long address,
        @NotNull
        @JsonAlias({"id_resident"})
        Long resident,
        @JsonAlias({"id_waste_collector"})
        Long wasteCollector
//        List<MaterialIdDTO> materials // Lista de materiais
) {
}
//{
//        "is_intern": true,
//        "schedule": "2024-09-01T10:00:00",
//        "picture": "coleta1.jpg",
//        "amount": 5,
//        "address_id": 1,
//        "resident_id": 2,
//        "waste_Collector_id": 3,
//        "materials": [
//        {
//        "materialId": 10,
//        "quantity": 2
//        },
//        {
//        "materialId": 15,
//        "quantity": 3
//        }
//        ]
//        }
