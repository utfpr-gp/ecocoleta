package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.adrress.AdrressDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.repositories.AddressRepository;
import com.ecocoleta.backend.repositories.UserRepository;
import com.ecocoleta.backend.services.AddressService;
import com.ecocoleta.backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;

@RestController
@RequestMapping("myaccount")
public class MyAccountController {

    //TODO FAZER... CONTROLLER PARA EDIÇAÕ E CADASTRO DE INFORMAÇÕES DE TODOS OS TIPOS DE USUARIOS.

    /*
     * CONTROLLER PARA EDIÇAÕ E CADASTRO DE INFORMAÇÕES DE TODOS OS TIPOS DE USUARIOS
     * EX: https://github.com/utfpr-gp/servicebook/blob/develop/src/main/java/br/edu/utfpr/servicebook/controller/MyAccountController.java
     * EDITA, VALIDA > EMAIL, NUMERO, FOTO.
     * EDITA, VALIDA > ENDEREÇO.
     * */

    @Autowired
    UserRepository userRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    private AddressService addressService;

    @Autowired
    UserService userService;

    //TODO  metodo myacont/id para pegar dados do usuario


    //TODO verifcar como fazer esse metodo
    //TODO metodos de ediçaõ e criação endereço.

    /*
        @PutMapping("/editAddress/{userId}")
        public ResponseEntity<?> editAddress(@PathVariable Long userId, @RequestBody @Valid AdrressDTO adrressDTO, UriComponentsBuilder uriComponentsBuilder) {

            System.out.println("ENTROU NO CONTORLLER PUT ADDRESS");
            // Busca o usuário por ID
            Optional<User> optionalUser = userService.getUserById(userId);

            if (optionalUser.isEmpty()) {
                System.err.println("User vazio!!!!");
                return ResponseEntity.notFound().build();
    //            throw new EntityNotFoundException("O usuário não foi encontrado.");
            }

            //verificar se ja esta cadastrado o mesmo endereço?

            Address address = new Address(adrressDTO.city(), adrressDTO.street(), adrressDTO.number(), adrressDTO.neighborhood(), adrressDTO.cep());

            System.out.println("cRIOU O OBJ ADDRESS: " + address.toString());

    //        addressRepository.save(address);

            User user = optionalUser.get();

            */
/*if (user instanceof Resident) {
            Resident resident = (Resident) user;
            resident.setAddress(address);
            userService.saveUser(resident);
        } else *//*

        if (user instanceof WasteCollector) {
            System.out.println("User instancia de WASTCOLLECTOR");
            WasteCollector wasteCollector = (WasteCollector) user;

            if (wasteCollector.getAddress() == null){
                System.out.println("address de watcolector vazio");

                System.out.println("salvar... obj address");
                addressRepository.save(address);
                System.out.println("salvo obj address/// set address e salvar user wastcolector");

                wasteCollector.setAddress(address);
                userService.saveUser(wasteCollector);

            }
            if (wasteCollector.getAddress() != null){
                System.out.println("address de watcolector != null não vazio");
            }

//            wasteCollector.setAddress(address);
//            userService.saveUser(wasteCollector);
        } else if (user instanceof Company) {
            System.out.println("User instancia de COMPANY");

            Company company = (Company) user;
            company.setAddress(address);
            userService.saveUser(company);
        } else {
            System.out.println("User instancia de ELSE NENHUM");

            // Lidar com outros tipos de usuários, se aplicável
            return ResponseEntity.badRequest().build();
        }

        System.out.println("SAIU DO CONTROLLER PUT ADDRESS");
        return ResponseEntity.ok().build();
    }
*/
    //GET
    /*@GetMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<?> getAddress(@PathVariable Long userId, UriComponentsBuilder uriComponentsBuilder) {}
*/

    //TODO fazer edição de endereço passadno o id do user pelo token, e id endereço pelo parametro
    //EDITAR
    @PutMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<?> editAddress(@PathVariable Long userId, @RequestBody @Valid AdrressDTO adrressDTO, UriComponentsBuilder uriComponentsBuilder) {

        System.out.println("ENTROU NO CONTORLLER PUT ADDRESS");
        // Busca o usuário por ID
        Optional<User> optionalUser = userService.getUserById(userId);

        if (optionalUser.isEmpty()) {
            System.err.println("User vazio!!!!");
            return ResponseEntity.notFound().build();
//            throw new EntityNotFoundException("O usuário não foi encontrado.");
        }

        User user = optionalUser.get();
        addressService.editAddress(user, adrressDTO);

        System.out.println("SAIU DO CONTROLLER PUT ADDRESS");
        return ResponseEntity.ok().build();

/*
        //        criando uma uri de forma automatica com spring passando para caminho user/id
        var uri = uriComponentsBuilder.path("/myaccount/addres/{id}").buildAndExpand(user.getId()).toUri();

        return ResponseEntity.created(uri).body(new AdrressDTO());*/
    }


    //TODO criação de endereços de residents verificar
    @PostMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<?> createAddress(@PathVariable Long userId, @RequestBody @Valid AdrressDTO adrressDTO, UriComponentsBuilder uriComponentsBuilder) {

        System.out.println("ENTROU NO CONTORLLER Post ADDRESS");
        // Busca o usuário por ID
        Optional<User> optionalUser = userService.getUserById(userId);

        if (optionalUser.isEmpty()) {
            System.err.println("User vazio!!!!");
            return ResponseEntity.notFound().build();
//            throw new EntityNotFoundException("O usuário não foi encontrado.");
        }

        User user = optionalUser.get();

        if (addressService.createAddress(user, adrressDTO)) {
            System.out.println("SAIU DO CONTROLLER POST ADDRESS com sucesso");
            return ResponseEntity.ok().build();
        }
        System.out.println("SAIU DO CONTROLLER POST ADDRESS com erro");
        return ResponseEntity.badRequest().build();


    /*//        criando uma uri de forma automatica com spring passando para caminho user/id
    var uri = uriComponentsBuilder.path("/user/{id}").buildAndExpand(user.getId()).toUri();

        return ResponseEntity.created(uri).body(new UserGetDTO(user));*/
    }
}
