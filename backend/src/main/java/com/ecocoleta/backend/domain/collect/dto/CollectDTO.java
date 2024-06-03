package com.ecocoleta.backend.domain.collect.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record CollectDTO(
        @NotNull
        @JsonAlias({"intern", "interno"}) boolean is_intern,
        //    @NotNull
        @Future
//        @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
        LocalDateTime schedule,
        //    @NotBlank
        String picture,
        @NotBlank
        String amount,
        @NotNull
        Long idAddress,
        @NotNull
        Long idResident,
        @NotNull
        Long idWasteCollector) {
}

