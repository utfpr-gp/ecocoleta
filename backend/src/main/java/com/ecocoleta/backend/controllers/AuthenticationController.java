package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.AuthenticationDTO;
import com.ecocoleta.backend.domain.LoginResponseDTO;
import com.ecocoleta.backend.services.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
        try {
            var token = authenticationService.authenticateAndGetToken(data.email(), data.password());

            return ResponseEntity.ok(new LoginResponseDTO(token));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
