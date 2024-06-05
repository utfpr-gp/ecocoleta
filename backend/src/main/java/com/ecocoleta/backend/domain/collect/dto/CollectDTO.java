package com.ecocoleta.backend.domain.collect.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

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
        Long idWasteCollector) {
}

