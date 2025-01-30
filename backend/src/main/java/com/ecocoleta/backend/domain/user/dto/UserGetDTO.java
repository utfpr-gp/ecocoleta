package com.ecocoleta.backend.domain.user.dto;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;

import java.time.LocalDateTime;
import java.util.Optional;

public record UserGetDTO(Long id, String name, String email, String phone, UserRole role, Boolean activo, LocalDateTime createTime, LocalDateTime updateTime) {
    public UserGetDTO(User user){
        this(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole(), user.getActivo(), user.getCreateTime(), user.getUpdateTime());
    }

    public UserGetDTO(Optional<User> user) {
        this(user.get().getId(), user.get().getName(), user.get().getEmail(), user.get().getPhone(), user.get().getRole(), user.get().getActivo(), user.get().getCreateTime(), user.get().getUpdateTime());

    }
}
