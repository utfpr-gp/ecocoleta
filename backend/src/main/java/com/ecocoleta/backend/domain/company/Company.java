package com.ecocoleta.backend.domain.company;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "companys")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@PrimaryKeyJoinColumn(name = "userId")
public class Company extends User {

    private String cnpj;
    private String company_name;
//    @OneToOne
//    @JoinColumn(name = "address_id")
//    protected Address address;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    public Company(String name, String company_name, String email, String password, String phone, UserRole role, String cnpj) {
        super(name, email, password, phone, role);
        this.cnpj = cnpj;
        this.company_name = company_name;
        this.createTime = LocalDateTime.now();
    }
}
