package com.ecocoleta.backend.domain.user;

public record UserGetListDTO(String name, String lastName, String email, String phone, UserRole role) {
    public UserGetListDTO(User user){
        this(user.getName(), user.getLastName(), user.getEmail(), user.getPhone(), user.getRole());
    }
}
