package com.ecocoleta.backend.domain.user;

import com.ecocoleta.backend.domain.user.dto.UserUpdateDTO;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Table(name = "users")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Inheritance(strategy = InheritanceType.JOINED)
public class User implements UserDetails, Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use GenerationType.IDENTITY para suportar autoincremento
    protected Long id;
    private String name;
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


    public User(String name, String email, String password, String phone, UserRole role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.activo = true;
        this.createTime = LocalDateTime.now();
    }

    @PostUpdate
    public void postUpdate() {
        this.updateTime = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == UserRole.ADMIN)
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
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

    public void update(UserUpdateDTO userUpdateDTO) {
        if (userUpdateDTO.name() != null) {
            this.name = userUpdateDTO.name();
        }
        if (userUpdateDTO.phone() != null) {
            this.phone = userUpdateDTO.phone();
        }
        if (userUpdateDTO.role() != null) {
            this.role = userUpdateDTO.role();
        }
        if (userUpdateDTO.email() != null) {
            this.email = userUpdateDTO.email();
        }
    }

    //TODO verificar reset de senha
    /*public void setPassword(String password) {
        this.password = PasswordUtil.generateBCrypt(password);
    }*/

    public void delete() {
        this.activo = false;
    }
}
