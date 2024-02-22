package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.repositories.AddressRepository;
import com.ecocoleta.backend.repositories.UserRepository;
import com.ecocoleta.backend.services.AddressService;
import com.ecocoleta.backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    //TODO fazer metodo get address
    //GET
    @GetMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<List<AddressDTO>> getAddress(@PathVariable Long userId, UriComponentsBuilder uriComponentsBuilder) {

        System.err.println("ENTROU NO CONTORLLER GET ADDRESS");
        // Busca o usuário por ID
        Optional<User> optionalUser = userService.getUserById(userId);

        if (optionalUser.isPresent()){
            System.err.println("        if (optionalUser.isPresent()){");
            //logica de busca endereço
            User user = optionalUser.get();
            List<Address> addresses = addressService.getUserAddresses(user);
            if (!addresses.isEmpty()){
                System.err.println("            if (!addresses.isEmpty()){\n");

                List<AddressDTO> addressDTOs = addresses.stream().map(address -> new AddressDTO(address.getCity(), address.getStreet(), address.getNumber(), address.getNeighborhood(), address.getCep())).collect(Collectors.toList());
                System.err.println("CONVERTEU A LISTA NO SERVICE CONTROLLER");

                System.err.println("RETURN....");
                return ResponseEntity.ok(addressDTOs);
            }else {
                System.err.println("User sem endereço!!!!");
                return ResponseEntity.notFound().build(); // Endereço não encontrado
            }
        } else {
            System.err.println("User vazio!!!!");
            return ResponseEntity.notFound().build();
//            throw new EntityNotFoundException("O usuário não foi encontrado.");
        }
    }


    //TODO fazer edição de endereço passadno o id do user pelo token, e id endereço pelo parametro >> ver metod post
    //EDITAR
    @PutMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<?> editAddress(@PathVariable Long userId, @RequestBody @Valid AddressDTO addressDTO, UriComponentsBuilder uriComponentsBuilder) {

        System.out.println("ENTROU NO CONTORLLER PUT ADDRESS");
        // Busca o usuário por ID
        Optional<User> optionalUser = userService.getUserById(userId);

        if (optionalUser.isEmpty()) {
            System.err.println("User vazio!!!!");
            return ResponseEntity.notFound().build();
//            throw new EntityNotFoundException("O usuário não foi encontrado.");
        }

        User user = optionalUser.get();
        addressService.editAddress(user, addressDTO);

        System.out.println("SAIU DO CONTROLLER PUT ADDRESS");
        return ResponseEntity.ok().build();

/*
        //        criando uma uri de forma automatica com spring passando para caminho user/id
        var uri = uriComponentsBuilder.path("/myaccount/addres/{id}").buildAndExpand(user.getId()).toUri();

        return ResponseEntity.created(uri).body(new AdrressDTO());*/
    }


    //TODO criação de endereços de residents verificar
    //TODO feito teste de pegar o id do user autenticado pelo @AuthenticationPrincipal
    //TODO verificar criação do endereço com o user atuthenticado ou admin***
    @PostMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<?> createAddress(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long userId, @RequestBody @Valid AddressDTO addressDTO, UriComponentsBuilder uriComponentsBuilder) throws Exception {

        //teste authentication
        //TODO retirar depois
        var userIdTeste = userService.getUserIdByUserEmail(userDetails.getUsername());
        System.err.println("userdetails injetado..." + userIdTeste);

        System.out.println("ENTROU NO CONTORLLER Post ADDRESS");
        // Busca o usuário por ID
        Optional<User> optionalUser = userService.getUserById(userId);

        if (optionalUser.isEmpty()) {
            System.err.println("User vazio!!!!");
            return ResponseEntity.notFound().build();
//            throw new EntityNotFoundException("O usuário não foi encontrado.");
        }

        User user = optionalUser.get();

        if (addressService.createAddress(user, addressDTO)) {
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
