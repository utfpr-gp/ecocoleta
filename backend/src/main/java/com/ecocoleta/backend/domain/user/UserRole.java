package com.ecocoleta.backend.domain.user;

public enum UserRole {
    ADMIN("ADMIN"),
    WASTE_COLLECTOR("WASTE_COLLECTOR"),
    RESIDENT("RESIDENT"),
    COMPANY("COMPANY");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
