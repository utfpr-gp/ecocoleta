package com.ecocoleta.backend.domain.wasteCollector;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.*;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;

import java.time.LocalDateTime;

@Table(name = "waste_collectors")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@PrimaryKeyJoinColumn(name = "id")
public class WasteCollector extends User {

    private String cpf;
    private Float score;
    private String picture;
    @Column(columnDefinition = "geography(Point, 4326)")
    private Point location;
    @Column(name = "location_updated")
    private LocalDateTime locationUpdated;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    public WasteCollector(String name, String email, String password, String phone, UserRole role, String cpf, String picture) {
        super(name, email, password, phone, role);
        this.cpf = cpf;
        this.picture = picture;
        this.createTime = LocalDateTime.now();
    }

    // Método para criar o Point (location) a partir de longitude e latitude
    public void setLocationFromCoordinates(Double latitude, Double longitude) {
        if (latitude != null && longitude != null) {
            GeometryFactory geometryFactory = new GeometryFactory();
            this.location = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        }
    }

    // Método para atualizar localização e tempo de atualização
    public void updateLocation(Double longitude, Double latitude) {
        if (longitude != null && latitude != null) {
            GeometryFactory geometryFactory = new GeometryFactory();
            this.location = geometryFactory.createPoint(new Coordinate(longitude, latitude));
            this.locationUpdated = LocalDateTime.now();
        } else {
            throw new IllegalArgumentException("Latitude e longitude não podem ser nulos");
        }
    }

    @Override
    public String toString() {
        return "WasteCollector{" +
                "id=" + id +
                ", cpf='" + cpf + '\'' +
                ", score=" + score +
                ", picture='" + picture + '\'' +
                ", location=" + location +
                ", locationUpdated=" + locationUpdated +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                '}';
    }
}
