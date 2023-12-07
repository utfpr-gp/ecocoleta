package com.ecocoleta.backend.domain.adrress;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "address")
@Entity(name = "Address")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use GenerationType.IDENTITY para suportar autoincremento
    private Long id;
    private String city;
    private String street;
    private String number;
    private String neighborhood;
    private String cep;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    public Address(String city, String street, String number, String neighborhood, String cep) {
        this.city = city;
        this.street = street;
        this.number = number;
        this.neighborhood = neighborhood;
        this.cep = cep;
        this.createTime = LocalDateTime.now();
    }
}