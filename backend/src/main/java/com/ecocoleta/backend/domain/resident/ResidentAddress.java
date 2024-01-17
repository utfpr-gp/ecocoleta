package com.ecocoleta.backend.domain.resident;

import com.ecocoleta.backend.domain.adrress.Address;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

/**
 * Classe para armazenar as informações necessárias para a classe auxiliar n x n
 */
//@Data
@Table(name = "residents_address")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude={"resident","address"})
public class ResidentAddress implements Serializable{

    /**
     * Chave composta referenciando um Resident e um Address.
     */
    @EmbeddedId
    private ResidentAddressId id = new ResidentAddressId();

    @ManyToOne
    @MapsId("residentId")
    @JoinColumn(name = "residents_id")
    private Resident resident;

    @ManyToOne
    @MapsId("addressId")
    @JoinColumn(name = "address_id")
    private Address address;

    public ResidentAddress(Resident resident, Address address) {
        this.resident = resident;
        this.address = address;
        this.id = new ResidentAddressId(resident.getId(), address.getId());
    }

    @Override
    public String toString() {
        return "ResidentAddress{" +
                "id=" + id +
                ", resident=" + resident.getId() +
                ", address=" + address +
                '}';
    }
}
