package com.ecocoleta.backend.domain.user.dto;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;

public record UserGetDTO(Long id, String name, String email, String phone, UserRole role) {
    public UserGetDTO(User user){
        this(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole());
    }
}
