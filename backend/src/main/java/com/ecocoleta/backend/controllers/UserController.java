package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserDTO;
import com.ecocoleta.backend.domain.user.UserGetDTO;
import com.ecocoleta.backend.domain.user.UserUpdateDTO;
import com.ecocoleta.backend.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Faz o cadastro do usuário individual ou empresa.
 * A principal diferença entre as duas entidades é o CPF e CNPJ. Em relação aos demais atributos, usa-se a classe User.
 */

@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    //TODO alterar para return 201

    //novo usuario com 201 http e uri
    @PostMapping()
    @Transactional
    public ResponseEntity newUser(@RequestBody @Valid UserDTO userDTO, UriComponentsBuilder uriComponentsBuilder){
//        System.out.println(userDTO.toString());
        if(this.userRepository.findByEmail(userDTO.email()) != null) return ResponseEntity.badRequest().build();
        String encryptedPassword = new BCryptPasswordEncoder().encode(userDTO.password());
        User user = new User(userDTO.name(), userDTO.lastName(), userDTO.email(), encryptedPassword, userDTO.phone(), userDTO.role());
        this.userRepository.save(user);
//        criando uma uri de forma automatica com spring passando para caminho user/id
        var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(user.getId()).toUri();

        return ResponseEntity.created(uri).body(new UserGetDTO(user));
    }
    /*@PostMapping("new")
    @Transactional
    public ResponseEntity newUser(@RequestBody @Valid UserDTO userDTO){
        if(this.userRepository.findByEmail(userDTO.email()) != null) return ResponseEntity.badRequest().build();
        String encryptedPassword = new BCryptPasswordEncoder().encode(userDTO.password());
        User newUser = new User(userDTO.name(), userDTO.lastName(), userDTO.email(), encryptedPassword, userDTO.phone(), userDTO.role());
        this.userRepository.save(newUser);

        return ResponseEntity.ok().build();
    }*/

    //Get User by id
    @GetMapping("/{id}")
    public ResponseEntity getUser(@PathVariable Long id){
        var user = userRepository.getReferenceById(id);

        return  ResponseEntity.ok(new UserGetDTO(user));
    }

    //TODO teste de return de lista users
    //TODO verificar listagem etc
    @GetMapping("list")
    public ResponseEntity<Page<UserGetDTO>> listUser(@PageableDefault(size = 10, sort = {"name"}) Pageable pageable){
        // usando obj tipo pageble para paginação
        //convertendo uma lista de User para UserListDTO(sem precisar retornar todos os atributos de User)
        var page = userRepository.findAllByActivoTrue(pageable).map(UserGetDTO::new);

        return ResponseEntity.ok(page);
    }

    //TODO update de senha

    //update
    @PutMapping
    @Transactional
    public ResponseEntity update(@RequestBody @Valid UserUpdateDTO userUpdateDTO){
        var user = userRepository.getReferenceById(userUpdateDTO.id());
        user.update(userUpdateDTO);

        return ResponseEntity.ok(new UserGetDTO(user));
    }

    //delete*disableUser com parametro dinamico
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity deleteUser(@PathVariable Long id){
//        userRepository.deleteById(id);
        var user = userRepository.getReferenceById(id);
        user.delete();

        return  ResponseEntity.noContent().build();
    }

}
