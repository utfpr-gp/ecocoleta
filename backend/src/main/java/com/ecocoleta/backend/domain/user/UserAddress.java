package com.ecocoleta.backend.domain.user;

import com.ecocoleta.backend.domain.address.Address;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Classe para armazenar as informações necessárias para a classe auxiliar n x n
 */
//@Data
@Data
@NoArgsConstructor
@Table(name = "user_addresses")
@Entity
public class UserAddress implements Serializable{

    /**
     * Chave composta referenciando um Resident e um Address.
     */
    @EmbeddedId
    private UserAddressPK id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @MapsId("addressId")
    @JoinColumn(name = "address_id")
    private Address address;

    public UserAddress(User user, Address address) {
        this.user = user;
        this.address = address;
        this.id = new UserAddressPK(user.getId(), address.getId());
    }

//
//    @Override
//    public String toString() {
//        return "ResidentAddress{" +
//                "id=" + id +
//                ", resident=" + resident.getId() +
//                ", address=" + address +
//                '}';
//    }
}
