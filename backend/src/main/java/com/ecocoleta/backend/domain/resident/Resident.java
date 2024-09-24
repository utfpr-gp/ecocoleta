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
@PrimaryKeyJoinColumn(name = "id")
public class Resident extends User {

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
                "create_time=" + createTime +
                ", updateTime=" + updateTime +
                ", id=" + id +
                '}';
    }
}
