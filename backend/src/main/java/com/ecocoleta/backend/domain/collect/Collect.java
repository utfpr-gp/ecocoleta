package com.ecocoleta.backend.domain.collect;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "collects")
@Entity(name = "Collect")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Collect {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use GenerationType.IDENTITY para suportar autoincremento
    private Long id;
    @Column(name = "is_intern")
    private boolean isIntern;
    private LocalDateTime schedule;
    private String picture;
    private Integer amount;
    @Enumerated(EnumType.STRING)
    private CollectStatus status;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private Address address;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id")
    private Resident resident;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waste_collector_id")
    private WasteCollector wasteCollector;

//    TODO fazer atributo 'lista de materias', assim não tendo relação direta nxn para entidade materials, salva uma lista de ids de materiais e ai retronar e salvar fica mais facil ?

    public Collect(boolean isIntern, String picture, Integer amount, CollectStatus status, Address address, Resident resident) {
        this.isIntern = isIntern;
        this.picture = picture;
        this.amount = amount;
        this.status = status;
        this.createTime = LocalDateTime.now();
        this.address = address;
        this.resident = resident;
    }

    @Override
    public String toString() {
        return "Collect{" +
                "id=" + id +
                ", isIntern=" + isIntern +
                ", schedule=" + schedule +
                ", picture='" + picture + '\'' +
                ", amount=" + amount +
                ", status=" + status +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                ", address=" + address +
                ", resident=" + resident +
                ", wasteCollector=" + wasteCollector +
                '}';
    }
}
