package com.ecocoleta.backend.domain.resident;

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
//@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "user_id")
public class Resident extends User {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    //TODO verifcicar relação de resident e user
//    @OneToOne(fetch = FetchType.LAZY)
//    @MapsId("user_id")
//    @PrimaryKeyJoinColumn(name = "user_id")
//    private User user;

    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    public Resident(String name, String email, String password, String phone, UserRole role) {
        super(name, email, password, phone, role);
        this.createTime = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Resident{" +
                "createTime=" + createTime +
                ", updateTime=" + updateTime +
                ", id=" + id +
                '}';
    }
}
