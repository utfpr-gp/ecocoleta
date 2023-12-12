package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.company.Company;
import com.ecocoleta.backend.domain.company.CompanyDTO;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.resident.ResidentDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.domain.user.dto.UserDTO;
import com.ecocoleta.backend.domain.user.dto.UserGetDTO;
import com.ecocoleta.backend.domain.user.dto.UserUpdateDTO;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollectorDTO;
import com.ecocoleta.backend.repositories.UserRepository;
import com.ecocoleta.backend.services.UserService;
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

    @Autowired
    UserService userService;

    /*//New user (ok)
    @PostMapping()
    @Transactional
    public ResponseEntity newUser(@RequestBody @Valid UserDTO userDTO, UriComponentsBuilder uriComponentsBuilder){
        if(this.userRepository.findByEmail(userDTO.email()) != null) return ResponseEntity.badRequest().build();
        String encryptedPassword = new BCryptPasswordEncoder().encode(userDTO.password());
        User user = new User(userDTO.name(), userDTO.lastName(), userDTO.email(), encryptedPassword, userDTO.phone(), userDTO.role());
        this.userRepository.save(user);
//        criando uma uri de forma automatica com spring passando para caminho user/id
        var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(user.getId()).toUri();

        return ResponseEntity.created(uri).body(new UserGetDTO(user));
    }*/

    //New user generico
    @PostMapping()
    @Transactional
    public ResponseEntity newUser(@RequestBody @Valid UserDTO userDTO, UriComponentsBuilder uriComponentsBuilder){
        if(this.userRepository.findByEmail(userDTO.email()) != null) return ResponseEntity.badRequest().build();

        String encryptedPassword = new BCryptPasswordEncoder().encode(userDTO.password());

        User user = new User(userDTO.name(), userDTO.lastName(), userDTO.email(), encryptedPassword, userDTO.phone(), userDTO.role());

        this.userRepository.save(user);

//        criando uma uri de forma automatica com spring passando para caminho user/id
        var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(user.getId()).toUri();

        return ResponseEntity.created(uri).body(new UserGetDTO(user));
    }

    //CRIAÇÃO DO TIPO RESIDENTS
    @PostMapping("/resident")
    @Transactional
    public ResponseEntity createUser(@RequestBody @Valid ResidentDTO residentDTO, UriComponentsBuilder uriComponentsBuilder){

        //Validação de email ja existente
        if(this.userRepository.findByEmail(residentDTO.email()) != null) return ResponseEntity.badRequest().build();
        //Validação tipo de ROLE
        if(residentDTO.role().equals(UserRole.RESIDENT)){
            System.err.println("ENTROU NO IF == RESIDENT.....");

            String encryptedPassword = new BCryptPasswordEncoder().encode(residentDTO.password());

            // Crie um novo Resident a partir do ResidentDTO
            Resident resident = new Resident(residentDTO.name(), residentDTO.lastName(), residentDTO.email(), encryptedPassword, residentDTO.phone(), residentDTO.role());

            // Salve o resident usando o UserService
            User savedUser = userService.saveUser(resident);

            //criando uma uri de forma automatica com spring passando para caminho user/id
            var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(savedUser.getId()).toUri();

            return ResponseEntity.created(uri).body(new UserGetDTO(savedUser));
        } return ResponseEntity.badRequest().build();
    }

    //CRIAÇÃO DO TIPO WASTE-COLLECTOR
    @PostMapping("/waste-collector")
    @Transactional
    public ResponseEntity createUser(@RequestBody @Valid WasteCollectorDTO wasteCollectorDTO, UriComponentsBuilder uriComponentsBuilder){

        //Validação de email ja existente
        if(this.userRepository.findByEmail(wasteCollectorDTO.email()) != null) return ResponseEntity.badRequest().build();
        //Validação tipo de ROLE
        if(wasteCollectorDTO.role().equals(UserRole.WASTE_COLLECTOR)){
            System.err.println("ENTROU NO IF == WASTE_COLLECTOR.....");

            String encryptedPassword = new BCryptPasswordEncoder().encode(wasteCollectorDTO.password());

            // Crie um novo Resident a partir do ResidentDTO
            WasteCollector wasteCollector = new WasteCollector(wasteCollectorDTO.name(), wasteCollectorDTO.lastName(), wasteCollectorDTO.email(), encryptedPassword, wasteCollectorDTO.phone(), wasteCollectorDTO.role(), wasteCollectorDTO.cpf(), wasteCollectorDTO.picture());

            // Salve o resident usando o UserService
            User savedUser = userService.saveUser(wasteCollector);

            //criando uma uri de forma automatica com spring passando para caminho user/id
            var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(savedUser.getId()).toUri();

            return ResponseEntity.created(uri).body(new UserGetDTO(savedUser));
        } return ResponseEntity.badRequest().build();
    }

    @PostMapping("/company")
    @Transactional
    public ResponseEntity createUser(@RequestBody @Valid CompanyDTO companyDTO, UriComponentsBuilder uriComponentsBuilder){

        //Validação de email ja existente
        if(this.userRepository.findByEmail(companyDTO.email()) != null) return ResponseEntity.badRequest().build();
        //Validação tipo de ROLE
        if(companyDTO.role().equals(UserRole.COMPANY)){
            System.err.println("ENTROU NO IF == COMPANY.....");

            String encryptedPassword = new BCryptPasswordEncoder().encode(companyDTO.password());

            // Crie um novo Resident a partir do ResidentDTO
            Company company = new Company(companyDTO.name(), companyDTO.lastName(), companyDTO.email(), encryptedPassword, companyDTO.phone(), companyDTO.role(), companyDTO.cnpj());

            // Salve o resident usando o UserService
            User savedUser = userService.saveUser(company);

            //criando uma uri de forma automatica com spring passando para caminho user/id
            var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(savedUser.getId()).toUri();

            return ResponseEntity.created(uri).body(new UserGetDTO(savedUser));
        } return ResponseEntity.badRequest().build();
    }





    //Get User by id
    @GetMapping("/{id}")
    public ResponseEntity getUser(@PathVariable Long id){
        var user = userRepository.getReferenceById(id);

        return  ResponseEntity.ok(new UserGetDTO(user));
    }

    //TODO teste de return de lista users
    //TODO verificar listagem etc
    //RETURN DE LISTA DE USUARIOS ACTIVO
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
    public ResponseEntity update(@Valid UserUpdateDTO userUpdateDTO){
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
