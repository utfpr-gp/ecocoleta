package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.LoginResponseDTO;
import com.ecocoleta.backend.domain.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    public String authenticateAndGetToken(String email, String password) {
        var usernamePasswordToken = new UsernamePasswordAuthenticationToken(email, password);
        var auth = this.authenticationManager.authenticate(usernamePasswordToken);

        return tokenService.generateToken((User) auth.getPrincipal());
    }
}
