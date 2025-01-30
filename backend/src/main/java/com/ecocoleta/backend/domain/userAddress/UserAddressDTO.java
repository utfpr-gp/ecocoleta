package com.ecocoleta.backend.domain.userAddress;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.user.User;
import jakarta.validation.constraints.NotBlank;

public record UserAddressDTO(
        @NotBlank
        User user,
        @NotBlank
        Address address
) {
}
