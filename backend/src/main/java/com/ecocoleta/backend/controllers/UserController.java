package com.ecocoleta.backend.controllers;

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
            var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(user.getId()).toUri();

            return ResponseEntity.created(uri).body(new UserGetDTO(user));
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
        if (userService.findByEmail(residentDTO.email()) == null && residentDTO.role().equals(UserRole.RESIDENT)) {
            System.out.println("criando novo usuario");
            //TODO Mapper user...
//            // Crie um novo Resident a partir do ResidentDTO
            Resident resident = new Resident(residentDTO.name(), residentDTO.email(), residentDTO.password(), residentDTO.phone(), residentDTO.role());
            User user = userService.createUser(resident);
//            criando uma uri de forma automatica com spring passando para caminho user/id
            var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(user.getId()).toUri();

            return ResponseEntity.created(uri).body(new UserGetDTO(user));
        } else {
            System.err.println("Email ja cadastrado");
            return ResponseEntity.badRequest().build();
        }
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
            var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(user.getId()).toUri();
//            var uriToken = uriComponentsBuilder.path("/auth/login").buildAndExpand(wasteCollectorDTO.email(), wasteCollectorDTO.password()).toUri();
            String token = authenticationService.authenticateAndGetToken(wasteCollectorDTO.email(), wasteCollectorDTO.password());
            return ResponseEntity.created(uri).body(new UserGetTokenDTO(user, token));

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
            var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(user.getId()).toUri();

            return ResponseEntity.created(uri).body(new UserGetDTO(user));
        } else {
            System.err.println("Email ja cadastrado");
            return ResponseEntity.badRequest().build();
        }
    }

    //Get User by id
    @GetMapping("/{id}")
    public ResponseEntity getUser(@PathVariable Long id) {
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

    //TODO update de senha, muda ra url colocando o parametro id...

    //update
    @PutMapping
    @Transactional
    public ResponseEntity update(@Valid UserUpdateDTO userUpdateDTO) {
        var user = userService.getUserById(userUpdateDTO.id());
        user.get().update(userUpdateDTO);

        return ResponseEntity.ok(new UserGetDTO(user));
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
