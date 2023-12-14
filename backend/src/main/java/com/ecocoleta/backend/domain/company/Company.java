package com.ecocoleta.backend.domain.company;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Table(name = "companys")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//@EqualsAndHashCode(of = "id")
@PrimaryKeyJoinColumn(name = "userId")
public class Company extends User {

    private String cnpj;
    //addrres id
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    public Company(String name, String lastName, String email, String password, String phone, UserRole role, String cnpj) {
        super(name, lastName, email, password, phone, role);
        this.cnpj = cnpj;
        this.createTime = LocalDateTime.now();
    }
}
