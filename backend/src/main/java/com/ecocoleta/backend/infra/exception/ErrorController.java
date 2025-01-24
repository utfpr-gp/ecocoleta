package com.ecocoleta.backend.infra.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;

@RestControllerAdvice
public class ErrorController {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<ExceptionErrorDTO>> exceptionError400(MethodArgumentNotValidException e) {
        var errors = e.getFieldErrors()
                .stream()
                .map(ExceptionErrorDTO::new)
                .toList();

        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ExceptionErrorDTO> exceptionError400Message(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(new ExceptionErrorDTO("payload", ex.getMessage()));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ExceptionErrorDTO> exceptionError404() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ExceptionErrorDTO("resource", "Entidade não encontrada"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionErrorDTO> exceptionError500(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ExceptionErrorDTO("server", "Erro interno no servidor: " + ex.getLocalizedMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ExceptionErrorDTO> exceptionErrorBadCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ExceptionErrorDTO("auth", "Credenciais inválidas"));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ExceptionErrorDTO> exceptionErrorAuthentication() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ExceptionErrorDTO("auth", "Falha na autenticação"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ExceptionErrorDTO> exceptionErroAccessDenied() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ExceptionErrorDTO("auth", "Acesso negado"));
    }

    @ExceptionHandler(ValidException.class)
    public ResponseEntity<ExceptionErrorDTO> exceptionErrorTreatBusinessRule(ValidException ex) {
        return ResponseEntity.badRequest().body(new ExceptionErrorDTO("business_rule", ex.getMessage()));
    }
}

//package com.ecocoleta.backend.infra.exception;
//
//import jakarta.persistence.EntityNotFoundException;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.http.converter.HttpMessageNotReadableException;
//import org.springframework.security.access.AccessDeniedException;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//@RestControllerAdvice
//public class ErrorController {
//
////    TODO verificar tradução dos erros, com arquivo properties, ou uma classe traduzida ...
//
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity exceptionError400(MethodArgumentNotValidException e){
//        var errors = e.getFieldErrors();
//
//        return ResponseEntity.badRequest().body(errors.stream().map(ExceptionErrorDTO::new).toList());
//    }
//
//    @ExceptionHandler(HttpMessageNotReadableException.class)
//    public ResponseEntity exceptionError400Message(HttpMessageNotReadableException ex) {
//        return ResponseEntity.badRequest().body(ex.getMessage());
//    }
//
//    @ExceptionHandler(EntityNotFoundException.class)
//    public ResponseEntity exceptionError404(){
//        return ResponseEntity.notFound().build();
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity exceptionError500(Exception ex) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro: " +ex.getLocalizedMessage());
//    }
//
//    @ExceptionHandler(BadCredentialsException.class)
//    public ResponseEntity exceptionErrorBadCredentials() {
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
//    }
//
//    @ExceptionHandler(AuthenticationException.class)
//    public ResponseEntity exceptionErrorAuthentication() {
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Falha na autenticação");
//    }
//
//    @ExceptionHandler(AccessDeniedException.class)
//    public ResponseEntity exceptionErroAccessDenied() {
//        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
//    }
//
//    //classe validação exception de regras de negócio genéricas
//    @ExceptionHandler(ValidException.class)
//    public ResponseEntity exceptionErrorTreatBusinessRule(ValidException ex) {
//        return ResponseEntity.badRequest().body(ex.getMessage());
//    }
//}
