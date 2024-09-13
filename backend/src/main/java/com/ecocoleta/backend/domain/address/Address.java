package com.ecocoleta.backend.domain.address;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;

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
    private Double latitude;
    private Double longitude;
    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point location;
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
        this.setLocationFromCoordinates(); // Define o Point automaticamente
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
        this.setLocationFromCoordinates(); // Define o Point automaticamente
    }

    // Método para criar o Point (location) a partir de latitude e longitude
    public void setLocationFromCoordinates() {
        if (latitude != null && longitude != null) {
            GeometryFactory geometryFactory = new GeometryFactory();
            this.location = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        }
    }

    // Se precisar modificar a latitude ou longitude, você pode usar este setter
    public void setLatitudeAndLongitude(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.setLocationFromCoordinates(); // Atualiza o Point com as novas coordenadas
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
                ", location=" + location +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                '}';
    }
}
