package com.ecocoleta.backend.domain.wasteCollector;

import com.ecocoleta.backend.domain.address.Address;
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

    /*public void setAddress(Address address) {
        // Certifique-se de que o endereço seja salvo antes de associá-lo ao WasteCollector
        if (address.getId() == null) {
            // Se o ID do endereço for nulo, salve-o no banco de dados
            AddressRepository.save(address);
        }

        // Agora, você pode associar o endereço ao WasteCollector
        this.address = address;
    }*/
}
