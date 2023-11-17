package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserDTO;
import com.ecocoleta.backend.domain.user.UserGetListDTO;
import com.ecocoleta.backend.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Faz o cadastro do usuário individual ou empresa.
 * A principal diferença entre as duas entidades é o CPF e CNPJ. Em relação aos demais atributos, usa-se a classe User.
 */

@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    //ResponseEntity ou void???
    @PostMapping("new")
    public ResponseEntity newUser(@RequestBody @Valid UserDTO userDTO){
//        System.out.println(userDTO.toString());
        if(this.userRepository.findByEmail(userDTO.email()) != null) return ResponseEntity.badRequest().build();
        String encryptedPassword = new BCryptPasswordEncoder().encode(userDTO.password());
        User newUser = new User(userDTO.name(), userDTO.lastName(), userDTO.email(), encryptedPassword, userDTO.phone(), userDTO.role());
        this.userRepository.save(newUser);
        return ResponseEntity.ok().build();
    }
    //TODO teste de retorn ode lista users

    @GetMapping("list")
    public List<UserGetListDTO> listUser(){
        //convertendo uma lista de User para UserListDTO(sem precisar retornar todos os atributos de User)
        return userRepository.findAll().stream().map(UserGetListDTO::new).toList();
    }

//TODO verificar listagem etc

    //update

    //delete*disableUser




}
