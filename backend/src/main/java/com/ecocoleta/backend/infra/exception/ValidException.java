package com.ecocoleta.backend.infra.exception;

public class ValidException extends RuntimeException {
    public ValidException(String mensagem) {
        super(mensagem);
    }
}

