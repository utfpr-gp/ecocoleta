package com.ecocoleta.backend.domain.user.dto;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;

import java.util.Optional;

public record UserGetTokenDTO(Long id, String name, String email, String phone, UserRole role, String token) {
    public UserGetTokenDTO(User user, String token){
        this(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole(), token);
    }

    public UserGetTokenDTO(Optional<User> user, String token) {
        this(user.get().getId(), user.get().getName(), user.get().getEmail(), user.get().getPhone(), user.get().getRole(), token);

    }
}
