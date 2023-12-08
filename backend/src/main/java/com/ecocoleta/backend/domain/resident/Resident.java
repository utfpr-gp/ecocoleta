/*
package com.ecocoleta.backend.domain.resident;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "residents")
@Entity(name = "Resident")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Resident extends User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use GenerationType.IDENTITY para suportar autoincremento
    private Long id;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;



//    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
//    protected Address address;

//    address_id  BIGSERIAL


public Resident(String name, String lastName, String email, String password, String phone, UserRole role) {
        super(name, lastName, email, password, phone, role);
        this.createTime = LocalDateTime.now();
    }


}
*/
