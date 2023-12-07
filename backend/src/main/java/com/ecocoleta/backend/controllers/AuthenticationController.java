package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.AuthenticationDTO;
import com.ecocoleta.backend.domain.LoginResponseDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.services.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
        try {
            var usernamePasswordToken = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var auth = this.authenticationManager.authenticate(usernamePasswordToken);

            var token = tokenService.generateToken((User) auth.getPrincipal());

            return ResponseEntity.ok(new LoginResponseDTO(token));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

//não usado, mudado para controller usar fazer o novo usuario
//    @PostMapping("/register")
//    public ResponseEntity register(@RequestBody @Valid RegisterDTO data){
//        if(this.userRepository.findByEmail(data.email()) != null) return ResponseEntity.badRequest().build();
//
//        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
//        User newUser = new User(data.email(), encryptedPassword, data.role());
//        this.userRepository.save(newUser);
//
//        return ResponseEntity.ok().build();
//    }

}
