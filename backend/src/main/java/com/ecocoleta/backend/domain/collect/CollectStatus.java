package com.ecocoleta.backend.domain.collect;

public enum CollectStatus {
    PENDING("PENDING"),
    IN_PROGRESS("IN_PROGRESS"),
    COMPLETED("COMPLETED"),
    CANCELLED("CANCELLED");

    private String status;

    CollectStatus(String status){
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
