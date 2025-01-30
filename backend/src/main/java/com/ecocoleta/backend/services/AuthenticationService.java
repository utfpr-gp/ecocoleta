package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    public String authenticateAndGetToken(String email, String password) {
        // Verifica se o usuário existe e está ativo
        User user = Optional.ofNullable(userRepository.findUserByEmailIs(email))
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        if (!user.getActivo()) {
            throw new ValidException("O usuário está desativado. Contate o administrador.");
        }

        // Autentica o usuário
        var usernamePasswordToken = new UsernamePasswordAuthenticationToken(email, password);
        var auth = this.authenticationManager.authenticate(usernamePasswordToken);

        // Gera o token
        return tokenService.generateToken((User) auth.getPrincipal());
    }
}
