package com.ecocoleta.backend.domain.user;

import com.ecocoleta.backend.domain.user.dto.UserUpdateDTO;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Table(name = "users")
@Entity(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use GenerationType.IDENTITY para suportar autoincremento
    private Long id;
    private String name;
    @Column(name = "last_name")
    private String lastName;
    @Column(nullable = false, unique = true)
    private String email;
    private String password;
    private String phone;
    @Enumerated(EnumType.STRING) // Mapear o enum para um tipo de dado string
    private UserRole role;
    private Boolean activo;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    //TODO verificar tipo de relacionamento, etc...

/*    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Resident resident;*/

    /*@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private WasteCollector wasteCollector;*/

    public User(String name, String lastName, String email, String password, String phone, UserRole role) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.activo = true;
        this.createTime = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == UserRole.ADMIN) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void update(UserUpdateDTO userUpdateDTO){
        if (userUpdateDTO.name() != null){
            this.name = userUpdateDTO.name();
            this.updateTime = LocalDateTime.now();
        }
        if (userUpdateDTO.lastName() != null){
            this.lastName = userUpdateDTO.lastName();
            this.updateTime = LocalDateTime.now();
        }
        if (userUpdateDTO.phone() != null){
            this.phone = userUpdateDTO.phone();
            this.updateTime = LocalDateTime.now();
        }
        if (userUpdateDTO.role() != null){
            this.role = userUpdateDTO.role();
            this.updateTime = LocalDateTime.now();
        }
    }

    /*public void setPassword(String password) {
        this.password = PasswordUtil.generateBCrypt(password);
    }*/

    public void delete() {
        this.activo = false;
    }
}
