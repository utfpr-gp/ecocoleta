package com.ecocoleta.backend.domain.material;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigInteger;
import java.time.LocalDateTime;

@Table(name = "materials")
@Entity(name = "Material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private String name;
    @Column(name = "score")
    private BigInteger score;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    public Material(String name, BigInteger score) {
        this.name = name;
        this.score = score;
        this.createTime = LocalDateTime.now();
    }

    public void update(MaterialDTO materialDTO){
        if (materialDTO.name() != null){
            this.name = materialDTO.name();
            this.updateTime = LocalDateTime.now();
        }
        if (materialDTO.score() != null){
            this.score = materialDTO.score();
            this.updateTime = LocalDateTime.now();
        }
    }
}
