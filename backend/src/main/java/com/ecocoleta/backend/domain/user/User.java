package com.ecocoleta.backend.domain.user;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Table(name = "users")
@Entity(name = "users")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use GenerationType.IDENTITY para suportar autoincremento
    private Long id;
    private String name;
    private String last_name;
    private String email;
    private String password;
    private String phone;
    @Enumerated(EnumType.STRING) // Mapear o enum para um tipo de dado string
    private UserRole role;
    private Timestamp update_time;
    private Timestamp create_time;

    //usado no registerDTO
    /*public User(String email, String password, UserRole role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }*/

    //constructor teste - pois esta como not null name etc no sql

    public User(String email, String password, UserRole role) {
        this.name = "teste-name";
        this.last_name = "teste-last-name";
        this.email = email;
        this.password = password;
        this.phone = "42999660090";
        this.role = role;
//        this.create_time = new Timestamp(System.currentTimeMillis());
//        Long datetime = System.currentTimeMillis();
//        Timestamp timestamp = new Timestamp(datetime);

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
}
