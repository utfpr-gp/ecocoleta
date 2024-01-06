package com.ecocoleta.backend.domain.wasteCollector;

import com.ecocoleta.backend.domain.adrress.Address;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "waste_collectors")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@PrimaryKeyJoinColumn(name = "userId")
public class WasteCollector extends User {

    private String cpf;
    private int score;
    private String picture;
    //addrres id
    //TODO verificar endereço como criar o objeto e relação
    @OneToOne
    @JoinColumn(name = "address_id")
    protected Address address;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    public WasteCollector(String name, String email, String password, String phone, UserRole role, String cpf, String picture) {
        super(name, email, password, phone, role);
        this.cpf = cpf;
        this.score = 0;
        this.picture = picture;
        this.createTime = LocalDateTime.now();
    }
}
