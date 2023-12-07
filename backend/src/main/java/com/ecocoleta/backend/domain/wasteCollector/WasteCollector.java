package com.ecocoleta.backend.domain.wasteCollector;

import com.ecocoleta.backend.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "waste_collectors")
@Entity(name = "WasteCollector")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class WasteCollector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use GenerationType.IDENTITY para suportar autoincremento
    private Long id;
    private String cpf;
    private int score;
    private String picture;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;


//    address_id  BIGSERIAL
}