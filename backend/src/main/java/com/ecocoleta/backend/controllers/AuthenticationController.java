package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.AuthenticationDTO;
import com.ecocoleta.backend.domain.LoginResponseDTO;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.services.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsável pela autenticação de usuários.
 */
@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * Endpoint para login de usuários.
     * Recebe email e senha para autenticação, retornando um token de acesso.
     *
     * @param data Dados de autenticação contendo email e senha.
     * @return Resposta com o token de autenticação ou erro.
     */
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
        try {
            var token = authenticationService.authenticateAndGetToken(data.email(), data.password());
            return ResponseEntity.ok(new LoginResponseDTO(token));
        } catch (Exception e) {
            // Lançamento de uma exceção personalizada em vez de capturar a exceção genérica
            throw new ValidException("Erro na autenticação: " + e.getMessage());
        }
    }
}
