package com.ecocoleta.backend.domain.userAddress;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class UserAddressPK implements Serializable {
    Long userId;
    Long addressId;
}
