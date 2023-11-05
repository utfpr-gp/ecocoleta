package com.ecocoleta.backend.domain.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.boot.model.relational.Database;

@Table(name = "users")
@Entity(name = "users")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class User {
    @Id
    private Long id;

    private String name;
    private String last_name;
    private String email;
    private String password;
    private String phone;
    private String role_id;
    private String update_time;
    private String create_time;


}
