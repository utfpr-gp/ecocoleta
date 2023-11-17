package com.ecocoleta.backend.domain.adrress;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "adrress")
@Entity(name = "adrress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Adrress {

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
}