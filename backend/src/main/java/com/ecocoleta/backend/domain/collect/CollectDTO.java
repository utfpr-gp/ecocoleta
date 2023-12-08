package com.ecocoleta.backend.domain.collect;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record CollectDTO(
    @NotNull
    boolean is_intern,
    @NotNull
    @Future
    LocalDateTime schedule,

    @NotBlank
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
