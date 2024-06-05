package com.ecocoleta.backend.domain.address;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "address")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use GenerationType.IDENTITY para suportar autoincremento
    private Long id;
    private String name;
    private String city;
    private String street;
    private String number;
    private String neighborhood;
    private String cep;
    @Column(name = "latitude")
    private Double latitude;
    @Column(name = "longitude")
    private Double longitude;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    public Address(String name, String city, String street, String number, String neighborhood, String cep, Double latitude, Double longitude) {
        this.name = name;
        this.city = city;
        this.street = street;
        this.number = number;
        this.neighborhood = neighborhood;
        this.cep = cep;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createTime = LocalDateTime.now();
    }

    public Address(Long id, String name, String city, String street, String number, String neighborhood, String cep, Double latitude, Double longitude) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.street = street;
        this.number = number;
        this.neighborhood = neighborhood;
        this.cep = cep;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createTime = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Address{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", city='" + city + '\'' +
                ", street='" + street + '\'' +
                ", number='" + number + '\'' +
                ", neighborhood='" + neighborhood + '\'' +
                ", cep='" + cep + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                '}';
    }
}
