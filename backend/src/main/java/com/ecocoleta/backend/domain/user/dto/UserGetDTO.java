package com.ecocoleta.backend.domain.user.dto;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;

import java.util.Optional;

public record UserGetDTO(Long id, String name, String email, String phone, UserRole role) {
    public UserGetDTO(User user){
        this(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole());
    }

    public UserGetDTO(Optional<User> user) {
        this(user.get().getId(), user.get().getName(), user.get().getEmail(), user.get().getPhone(), user.get().getRole());

    }
}
