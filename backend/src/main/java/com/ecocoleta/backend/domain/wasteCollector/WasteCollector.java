package com.ecocoleta.backend.domain.wasteCollector;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "waste_collectors")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@PrimaryKeyJoinColumn(name = "id")
public class WasteCollector extends User {

    private String cpf;
    private Integer score;
    private String picture;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

//TODO add  atributos para sincronizar icones no mapa do catadores atuais:
// localização_updated - date?
// localização atual - geo-point?
// fazer sincronismo no front som stTimeOut de 5 min manda localização?
// trazer dados para front  onde o localização_updated < que 30 min


    public WasteCollector(String name, String email, String password, String phone, UserRole role, String cpf, String picture) {
        super(name, email, password, phone, role);
        this.cpf = cpf;
        this.picture = picture;
        this.createTime = LocalDateTime.now();
    }
}
