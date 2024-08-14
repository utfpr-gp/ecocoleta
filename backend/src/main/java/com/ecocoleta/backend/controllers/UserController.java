package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.LoginResponseDTO;
import com.ecocoleta.backend.domain.company.Company;
import com.ecocoleta.backend.domain.company.CompanyDTO;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.resident.ResidentDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.domain.user.dto.UserDTO;
import com.ecocoleta.backend.domain.user.dto.UserGetDTO;
import com.ecocoleta.backend.domain.user.dto.UserGetTokenDTO;
import com.ecocoleta.backend.domain.user.dto.UserUpdateDTO;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollectorDTO;
import com.ecocoleta.backend.services.AuthenticationService;
import com.ecocoleta.backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Faz o cadastro do usuário individual ou empresa.
 * A principal diferença entre as duas entidades é o CPF e CNPJ. Em relação aos demais atributos, usa-se a classe User.
 */

//TODO colocar restrição de roles em cada endpoint e autenticação //    @RolesAllowed({RoleType.USER, RoleType.COMPANY})

@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    private AuthenticationService authenticationService;

    //CREATE USER TYPE ADMIN
    @PostMapping("/admin")
    @Transactional
//    @RolesAllowed("ADMIN")
    public ResponseEntity newUser(@AuthenticationPrincipal UserDetails userDetails, @RequestBody @Valid UserDTO userDTO, UriComponentsBuilder uriComponentsBuilder) {
        System.out.println("ENTROU CONTROLER ADMIN...");
        //verifica se existe, se role é admin e se user autenticado é admin
        if (userService.findByEmail(userDTO.email()) == null && userDTO.role().equals(UserRole.ADMIN) && userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            System.out.println("criando novo usuario");
            //TODO Mapper user...
            User user = new User(userDTO.name(), userDTO.email(), userDTO.password(), userDTO.phone(), userDTO.role());
            userService.createUser(user);

//            criando uma uri de forma automatica com spring passando para caminho user/id
//            var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(user.getId()).toUri();
            String token = authenticationService.authenticateAndGetToken(userDTO.email(), userDTO.password());
            return ResponseEntity.ok().body(new LoginResponseDTO(token));
//            return ResponseEntity.created(uri).body(new UserGetTokenDTO(user, token));


//            return ResponseEntity.created(uri).body(new UserGetDTO(user));
        } else {
            System.err.println("Email ja cadastrado ou sem permissão de admin");
            return ResponseEntity.badRequest().build();
        }
    }

    //CRIAÇÃO DO TIPO RESIDENTS
    @PostMapping("/resident")
    @Transactional
    public ResponseEntity createUser(@RequestBody @Valid ResidentDTO residentDTO, UriComponentsBuilder uriComponentsBuilder) {
        System.out.println("ENTROU CONTROLLER RESIDENT...");

        // Verifica se o e-mail já está cadastrado e se o papel é de RESIDENT
        if (userService.findByEmail(residentDTO.email()) != null) {
            System.err.println("Email já cadastrado");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email já cadastrado");
        }

        if (!residentDTO.role().equals(UserRole.RESIDENT)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Role inválido para este endpoint");
        }

        System.out.println("Criando novo usuário");

//        TODO criar classe mapper resident
        // Converte o DTO em uma entidade Resident
//        Resident resident = userMapper.toEntity(residentDTO);
        Resident resident = new Resident(residentDTO.name(), residentDTO.email(), residentDTO.password(), residentDTO.phone(), residentDTO.role());

        // Cria o usuário usando o serviço
        userService.createUser(resident);

        // Gera o token de autenticação
        String token = authenticationService.authenticateAndGetToken(residentDTO.email(), residentDTO.password());

        // Cria uma URI para o novo recurso
//        var uri = uriComponentsBuilder.path("/api/v1/users/{id}").buildAndExpand(user.getId()).toUri();

        // Retorna a resposta com o token de login
//        return ResponseEntity.created(uri).body(new LoginResponseDTO(token));
        return ResponseEntity.status(HttpStatus.CREATED).body(new LoginResponseDTO(token));
    }

    //CRIAÇÃO DO TIPO WASTE-COLLECTOR
    @PostMapping("/waste-collector")
    @Transactional
    public ResponseEntity createUser(@RequestBody @Valid WasteCollectorDTO wasteCollectorDTO, UriComponentsBuilder uriComponentsBuilder) {
        System.out.println("ENTROU CONTROLLER WASTECOLLECTOR...");

        if (userService.findByEmail(wasteCollectorDTO.email()) == null && wasteCollectorDTO.role().equals(UserRole.WASTE_COLLECTOR)) {
            System.out.println("criando novo usuario");
            //TODO Mapper user...
//            // Crie um novo Resident a partir do WasteCollectorDTO
            WasteCollector wasteCollector = new WasteCollector(wasteCollectorDTO.name(), wasteCollectorDTO.email(), wasteCollectorDTO.password(), wasteCollectorDTO.phone(), wasteCollectorDTO.role(), wasteCollectorDTO.cpf(), wasteCollectorDTO.picture());
            User user = userService.createUser(wasteCollector);
//            criando uma uri de forma automatica com spring passando para caminho user/id
//            var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(user.getId()).toUri();
//            var uriToken = uriComponentsBuilder.path("/auth/login").buildAndExpand(wasteCollectorDTO.email(), wasteCollectorDTO.password()).toUri();
            String token = authenticationService.authenticateAndGetToken(wasteCollectorDTO.email(), wasteCollectorDTO.password());
            return ResponseEntity.ok().body(new LoginResponseDTO(token));
//            return ResponseEntity.created(uri).body(new UserGetTokenDTO(user, token));

//            return ResponseEntity.created(uriToken).body(new UserGetTokenDTO(user));
        } else {
            System.err.println("Email ja cadastrado");
            //TODO fazer exeption correspondente
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/company")
    @Transactional
    public ResponseEntity createUser(@RequestBody @Valid CompanyDTO companyDTO, UriComponentsBuilder uriComponentsBuilder) {
        System.out.println("ENTROU CONTROLLER COMPANY...");

        if (userService.findByEmail(companyDTO.email()) == null && companyDTO.role().equals(UserRole.COMPANY)) {
            System.out.println("criando novo usuario");
            //TODO Mapper user...
//            // Crie um novo Resident a partir do companyDTO
            Company company = new Company(companyDTO.name(), companyDTO.companyName(), companyDTO.email(), companyDTO.password(), companyDTO.phone(), companyDTO.role(), companyDTO.cnpj());
            User user = userService.createUser(company);
//            criando uma uri de forma automatica com spring passando para caminho user/id
//            var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(user.getId()).toUri();
            String token = authenticationService.authenticateAndGetToken(companyDTO.email(), companyDTO.password());
            return ResponseEntity.ok().body(new LoginResponseDTO(token));
//            return ResponseEntity.created(uri).body(new UserGetTokenDTO(user, token));

//            return ResponseEntity.created(uri).body(new UserGetDTO(user));
        } else {
            System.err.println("Email ja cadastrado");
            return ResponseEntity.badRequest().build();
        }
    }

    //Get User by id
    @GetMapping("/{id}")
    public ResponseEntity getUser(@PathVariable Long id) {
        //TODO verificar se user que solicitou req é o mesmo do id ou é admin ou company???
        //TODO melhorar esse metodo trazendo dados de todos tipos de user roles, tip owaste... trazer cpf, picture...
        var user = userService.getUserById(id);

        return ResponseEntity.ok(new UserGetDTO(user));
    }

    //TODO teste de return de lista users
    //TODO verificar listagem etc
    //RETURN DE LISTA DE USUARIOS ACTIVO
    @GetMapping("list")
    public ResponseEntity<Page<UserGetDTO>> listUser(@PageableDefault(size = 10, sort = {"name"}) Pageable pageable) {
        // usando obj tipo pageble para paginação
        //convertendo uma lista de User para UserListDTO(sem precisar retornar todos os atributos de User)
        var page = userService.getAllByActivoTrue(pageable).map(UserGetDTO::new);
        return ResponseEntity.ok(page);
    }

    //TODO update de senha...

    //update
    @PutMapping
    @Transactional
    public ResponseEntity update(@RequestBody @Valid UserUpdateDTO userUpdateDTO) {
        //TODO melhorar esse metodo para todos tipos de usuario, fazer um body dto generico para todas roles, etc
        System.out.println("ENTROU UPDATE...");
        System.out.println("tostring: " + userUpdateDTO.toString());

        var user = userService.getUserById(userUpdateDTO.id());
        user.get().update(userUpdateDTO);

        return ResponseEntity.ok(new UserGetDTO(user));
//        return ResponseEntity.ok().build();
    }

    //delete*disableUser com parametro dinamico
    //TODO refazer com authenticação somente para user tipo admin
    //TODO refazer delete para deletar os demais relações com o user, address, colects...
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity deleteUser(@PathVariable Long id) {
        var user = userService.getUserById(id);
        user.get().delete();

        return ResponseEntity.noContent().build();
    }

}
