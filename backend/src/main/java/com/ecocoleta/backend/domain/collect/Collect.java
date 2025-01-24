package com.ecocoleta.backend.domain.collect;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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
    private Integer amount;
    @Column(name = "is_evaluated", nullable = false)
    private boolean isEvaluated = false; // Inicia como não avaliado
    private Integer rating; // Avaliação opcional (1-5 estrelas)
    @Enumerated(EnumType.STRING)
    private CollectStatus status;
    @Column(name = "init_time")
    private LocalDateTime initTime;
    @Column(name = "end_time")
    private LocalDateTime endTime;
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
    // Lista de materiais baseada no enum
    @Column(name = "materials")
    @Convert(converter = CollectMaterialsConverter.class) // Usando o conversor
    private List<CollectMaterials> materials;

    public Collect(Integer amount, Address address, Resident resident, List<CollectMaterials> materials) {
        this.amount = amount;
        this.address = address;
        this.resident = resident;
        this.materials = materials;
    }

    @PrePersist
    public void prePersist() {
        this.status = CollectStatus.PENDING;
        this.createTime = LocalDateTime.now();
    }

    @PostUpdate
    public void postPersist() {
        this.updateTime = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Collect{" +
                "id=" + id +
                ", amount=" + amount +
                ", status=" + status +
                ", initTime=" + initTime +
                ", endTime=" + endTime +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                ", address=" + (address != null ? address.getId() : "null") +
                ", resident=" + (resident != null ? resident.getId() : "null") +
                ", wasteCollector=" + (wasteCollector != null ? wasteCollector.getId() : "null") +
                ", materials=" + materials +
                '}';
    }
}
