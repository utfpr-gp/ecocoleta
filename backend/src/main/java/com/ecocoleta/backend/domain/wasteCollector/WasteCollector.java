package com.ecocoleta.backend.domain.wasteCollector;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "waste_collectors")
@Entity(name = "wasteCollector")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//@EqualsAndHashCode(of = "id")
public class WasteCollector extends User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use GenerationType.IDENTITY para suportar autoincremento
    private Long id;
    private String cpf;
    private int score;
    private String picture;
    //addrres id
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    public WasteCollector(String name, String lastName, String email, String password, String phone, UserRole role, String cpf, String picture) {
        super(name, lastName, email, password, phone, role);
        this.cpf = cpf;
        this.score = 0;
        this.picture = picture;
        this.createTime = LocalDateTime.now();
    }
}
