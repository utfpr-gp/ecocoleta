package com.ecocoleta.backend.infra.exception;

import org.springframework.validation.FieldError;

public record ExceptionErrorDTO(String value, String message) {

    public ExceptionErrorDTO(FieldError error){
        this(error.getField(), error.getDefaultMessage());
    }
}
