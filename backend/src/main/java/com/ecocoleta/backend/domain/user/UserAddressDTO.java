package com.ecocoleta.backend.domain.user;

import com.ecocoleta.backend.domain.address.Address;
import jakarta.validation.constraints.NotBlank;

public record UserAddressDTO(
        @NotBlank
        User user,
        @NotBlank
        Address address
) {
}
