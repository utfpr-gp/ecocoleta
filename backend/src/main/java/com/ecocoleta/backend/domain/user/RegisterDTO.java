package com.ecocoleta.backend.domain.user;

public record RegisterDTO(String email, String password, UserRole role) {
}
