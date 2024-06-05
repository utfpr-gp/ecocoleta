package com.ecocoleta.backend.domain;

public class ValidException extends RuntimeException {
    public ValidException(String mensagem) {
        super(mensagem);
    }
}

