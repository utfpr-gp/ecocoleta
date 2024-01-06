package com.ecocoleta.backend.domain.resident;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * Classe auxiliar para chave composta em um relacionamento n x n.
 *
 */
//@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@Getter
@Setter
public class ResidentAddressId implements Serializable {

    @Column(name = "residents_id")
    private Long residentId;

    @Column(name = "address_id")
    private Long addressId;
}
