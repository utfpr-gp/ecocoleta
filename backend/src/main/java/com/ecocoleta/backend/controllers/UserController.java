package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.LoginResponseDTO;
import com.ecocoleta.backend.domain.company.Company;
import com.ecocoleta.backend.domain.company.dto.CompanyDTO;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.resident.dto.ResidentDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.domain.user.dto.UserDTO;
import com.ecocoleta.backend.domain.user.dto.UserGetDTO;
import com.ecocoleta.backend.domain.user.dto.UserTypeCountDTO;
import com.ecocoleta.backend.domain.user.dto.UserUpdateDTO;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.domain.wasteCollector.dto.WasteCollectorDTO;
import com.ecocoleta.backend.infra.exception.ValidException;
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

import java.util.List;

/**
 * Controlador REST para operações relacionadas a usuários.
 * Faz o cadastro do usuário individual ou empresa.
 * A principal diferença entre as duas entidades é o CPF e CNPJ. Em relação aos demais atributos, usa-se a classe User.
 */
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
    public ResponseEntity newUser(@AuthenticationPrincipal UserDetails userDetails, @RequestBody @Valid UserDTO userDTO) {
        // Verifica se o e-mail já está cadastrado e se o role é ADMIN
        if (userService.findByEmail(userDTO.email()) != null) {
            throw new ValidException("Email já cadastrado");
        }
        if (!userDTO.role().equals(UserRole.ADMIN)) {
            throw new ValidException("Role inválido para este endpoint");
        }
        if (!userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new ValidException("Usuário não autorizado");
        }

        // Criação do novo usuário com a role ADMIN
        User user = new User(userDTO.name(), userDTO.email(), userDTO.password(), userDTO.phone(), userDTO.role());
        userService.createUser(user);

        String token = authenticationService.authenticateAndGetToken(userDTO.email(), userDTO.password());
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    //CRIAÇÃO DO TIPO RESIDENT
    @PostMapping("/resident")
    @Transactional
    public ResponseEntity createUser(@RequestBody @Valid ResidentDTO residentDTO) {
        // Verifica se o e-mail já está cadastrado
        if (userService.findByEmail(residentDTO.email()) != null) {
            throw new ValidException("Email já cadastrado");
        }
        if (!residentDTO.role().equals(UserRole.RESIDENT)) {
            throw new ValidException("Role inválido para este endpoint");
        }

        // Criação do novo usuário com a role RESIDENT
        Resident resident = new Resident(residentDTO.name(), residentDTO.email(), residentDTO.password(), residentDTO.phone(), residentDTO.role());
        userService.createUser(resident);

        String token = authenticationService.authenticateAndGetToken(residentDTO.email(), residentDTO.password());
        return ResponseEntity.status(201).body(new LoginResponseDTO(token));
    }

    //CRIAÇÃO DO TIPO WASTE-COLLECTOR
    @PostMapping("/waste-collector")
    @Transactional
    public ResponseEntity createUser(@RequestBody @Valid WasteCollectorDTO wasteCollectorDTO) {
        // Verifica se o e-mail já está cadastrado
        if (userService.findByEmail(wasteCollectorDTO.email()) != null) {
            throw new ValidException("Email já cadastrado");
        }
        if (!wasteCollectorDTO.role().equals(UserRole.WASTE_COLLECTOR)) {
            throw new ValidException("Role inválido para este endpoint");
        }

        // Criação do novo usuário com a role WASTE_COLLECTOR
        WasteCollector wasteCollector = new WasteCollector(wasteCollectorDTO.name(), wasteCollectorDTO.email(), wasteCollectorDTO.password(), wasteCollectorDTO.phone(), wasteCollectorDTO.role(), wasteCollectorDTO.cpf(), wasteCollectorDTO.picture());
        userService.createUser(wasteCollector);

        String token = authenticationService.authenticateAndGetToken(wasteCollectorDTO.email(), wasteCollectorDTO.password());
        return ResponseEntity.status(201).body(new LoginResponseDTO(token));
    }

    @PostMapping("/company")
    @Transactional
    public ResponseEntity createUser(@RequestBody @Valid CompanyDTO companyDTO) {
        // Verifica se o e-mail já está cadastrado
        if (userService.findByEmail(companyDTO.email()) != null) {
            throw new ValidException("Email já cadastrado");
        }
        if (!companyDTO.role().equals(UserRole.COMPANY)) {
            throw new ValidException("Role inválido para este endpoint");
        }

        // Criação do novo usuário com a role COMPANY
        Company company = new Company(companyDTO.name(), companyDTO.companyName(), companyDTO.email(), companyDTO.password(), companyDTO.phone(), companyDTO.role(), companyDTO.cnpj());
        userService.createUser(company);

        String token = authenticationService.authenticateAndGetToken(companyDTO.email(), companyDTO.password());
        return ResponseEntity.status(201).body(new LoginResponseDTO(token));
    }

    // Get User by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        Object userDto = userService.getUserDtoById(id);
        return ResponseEntity.ok(userDto);
    }

//    // Listagem de usuários ativos
//    @GetMapping("/list")
//    public ResponseEntity<Page<UserGetDTO>> listUser(@PageableDefault(size = 10, sort = {"name"}) Pageable pageable) {
//        var page = userService.getAllByActivoTrue(pageable).map(UserGetDTO::new);
//        return ResponseEntity.ok(page);
//    }

    /** Listagem de usuários com filtro opcional por tipo */
    @GetMapping("/list")
    public ResponseEntity<Page<UserGetDTO>> listUsers(
            @RequestParam(required = false) UserRole role,
            @PageableDefault(size = 10, sort = {"name"}) Pageable pageable) {
        Page<UserGetDTO> users = userService.getUsersByRole(role, pageable);
        return ResponseEntity.ok(users);
    }

    /** Alterna o status ativo/inativo de um usuário */
    @PutMapping("/toggle-status/{id}/{status}")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable Long id, @PathVariable boolean status) {
        userService.toggleUserStatus(id, status);
        return ResponseEntity.ok().build();
    }

    /**
     * Obtém a contagem de usuários por tipo.
     *
     * @return ResponseEntity contendo uma lista de UserTypeCountDTO com as contagens de usuários.
     */
    @GetMapping("/user-report")
    public ResponseEntity<List<UserTypeCountDTO>> getUserReport() {
        return ResponseEntity.ok(userService.getUserTypeCounts());
    }

    @GetMapping("/waste-collectors")
    public ResponseEntity<Page<UserGetDTO>> listWasteCollectors(
            @PageableDefault(size = 10, sort = {"name"}) Pageable pageable) {
        var page = userService.getAllByRole(UserRole.WASTE_COLLECTOR, pageable)
                .map(UserGetDTO::new);
        return ResponseEntity.ok(page);
    }

    // Update de usuário
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody @Valid UserUpdateDTO userUpdateDTO) {
        var user = userService.getUserById(id);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        user.get().update(userUpdateDTO);
        return ResponseEntity.ok(new UserGetDTO(user));
    }

    // Deletar usuário
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity deleteUser(@PathVariable Long id) {
        var user = userService.getUserById(id);
        user.get().delete();
        return ResponseEntity.noContent().build();
    }
}