package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.AuthenticationDTO;
import com.ecocoleta.backend.domain.LoginResponseDTO;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.services.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controller responsável pela autenticação de usuários.
 */
@RestController
@RequestMapping("auth")
@Tag(name = "Autenticação", description = "Gerenciamento de autenticação e tokens de acesso")
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
    @Operation(summary = "Login de usuários", description = "Autentica o usuário com base no email e senha, retornando um token de acesso.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Autenticação bem-sucedida",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Erro de validação nos dados de entrada",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor",
                    content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data) {
        try {
            var token = authenticationService.authenticateAndGetToken(data.email(), data.password());
            return ResponseEntity.ok(new LoginResponseDTO(token));
        } catch (Exception e) {
            throw new ValidException("Erro na autenticação: " + e.getMessage());
        }
    }
}
