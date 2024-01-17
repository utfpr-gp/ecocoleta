package com.ecocoleta.backend.domain.resident;

import com.ecocoleta.backend.domain.adrress.Address;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Table(name = "residents")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@PrimaryKeyJoinColumn(name = "userId")
public class Resident extends User {

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, orphanRemoval = true)
    protected Set<ResidentAddress> residentAddresses = new HashSet<>();
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    public Resident(String name, String email, String password, String phone, UserRole role) {
        super(name, email, password, phone, role);
        this.createTime = LocalDateTime.now();
    }

    public void addAddress(Address address) {
        System.out.println("METOD ADDRESS CLASSE RESIDENTS.. PRINT>> " + address.toString());
        ResidentAddress residentAddress = new ResidentAddress(this, address);
        residentAddresses.add(residentAddress);
    }


}
