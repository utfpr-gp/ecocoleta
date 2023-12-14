package com.ecocoleta.backend.domain.resident;

import com.ecocoleta.backend.domain.adrress.Address;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "residents")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@PrimaryKeyJoinColumn(name = "userId")
public class Resident extends User {

    //addrres id
    /*@ManyToOne
    private Address address;*/
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

public Resident(String name, String lastName, String email, String password, String phone, UserRole role) {
        super(name, lastName, email, password, phone, role);
        this.createTime = LocalDateTime.now();
    }
}
