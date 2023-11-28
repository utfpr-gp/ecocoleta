package com.ecocoleta.backend.domain.user;

public record UserGetDTO(Long id, String name, String lastName, String email, String phone, UserRole role) {
    public UserGetDTO(User user){
        this(user.getId(), user.getName(), user.getLastName(), user.getEmail(), user.getPhone(), user.getRole());
    }
}
