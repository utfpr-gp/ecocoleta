package com.ecocoleta.backend.domain.collect;

/*import com.ecocoleta.backend.domain.adrress.Address;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;*/
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
    private String amount;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;
//    @OneToOne
//    @JoinColumn(name = "address_id")
//    private Address address;
//    @ManyToOne
//    @JoinColumn(name = "resident_id")
//    private Resident resident;
//    @OneToOne
//    @JoinColumn(name = "waste_collectors_id")
//    private WasteCollector wasteCollector;

}
