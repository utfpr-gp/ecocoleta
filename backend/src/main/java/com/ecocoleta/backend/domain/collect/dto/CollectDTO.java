package com.ecocoleta.backend.domain.collect.dto;

import com.ecocoleta.backend.domain.material.MaterialDTO;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.List;

public record CollectDTO(
        @NotNull
        @JsonAlias({"intern", "interno"})
        boolean is_intern,
        @Future
//        @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
        LocalDateTime schedule,
        String picture,
//        @NotBlank
//        @Pattern(regexp = "^([1-9]|[1-9][0-9])$", message = "O número deve ser entre 1 e 99")
        Integer amount,
        @NotNull
        Long idAddress,
        @NotNull
        Long idResident,
        Long idWasteCollector,
        List<MaterialDTO> materials // Lista de materiais
) {
}


//{
//        "is_intern": true,
//        "schedule": "2024-09-01T10:00:00",
//        "picture": "coleta1.jpg",
//        "amount": 5,
//        "idAddress": 1,
//        "idResident": 2,
//        "idWasteCollector": 3,
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

