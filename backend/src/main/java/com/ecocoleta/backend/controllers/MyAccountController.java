package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.userAddress.UserAddress;
import com.ecocoleta.backend.services.AddressService;
import com.ecocoleta.backend.services.AutorizationService;
import com.ecocoleta.backend.services.UserAddressService;
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
    UserService userService;

    @Autowired
    AutorizationService autorizationService;

    @Autowired
    AddressService addressService;

    @Autowired
    UserAddressService userAddressService;

    //TODO  metodo myacont/id para pegar dados do usuario

    //TODO refatorar retorno com exceptions adequadas....

    //Metodos de Address>>>>>
    //CREATE
    @PostMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<?> createAddress(@PathVariable Long userId, @RequestBody @Valid AddressDTO addressDTO, UriComponentsBuilder uriComponentsBuilder) throws Exception {

        System.out.println("ENTROU NO CONTORLLER Post ADDRESS");
        // Busca o usuário por ID
        Optional<User> optionalUser = userService.getUserById(userId);

        if (optionalUser.isEmpty()) {
            System.err.println("User não encontrado!!!!");
            return ResponseEntity.notFound().build();
        } else {
            System.out.println("User encontrado!!!!");
            User user = optionalUser.get();

//            System.out.println("AddressDTO: " + addressDTO.city() + " " + addressDTO.street() + " " + addressDTO.number() + " " + addressDTO.neighborhood() + " " + addressDTO.cep());
            //TODO fazer Mapper para transformar AddressDTO em Address
            Address address = new Address(addressDTO.name(), addressDTO.city(), addressDTO.street(), addressDTO.number(), addressDTO.neighborhood(), addressDTO.cep(), addressDTO.latitude(), addressDTO.longitude());
            UserAddress userAddress = new UserAddress(user, address);

            if (userAddressService.createAddress(userAddress)) {
                System.out.println("SAIU DO CONTROLLER POST ADDRESS com sucesso");
                return ResponseEntity.ok().build();
            } else {
                System.err.println("SAIU DO CONTROLLER POST ADDRESS com erro");
                return ResponseEntity.badRequest().build();
            }
        }
    }

    //GET
    @GetMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<List<AddressDTO>> getAddress(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long userId, UriComponentsBuilder uriComponentsBuilder) {
        System.out.println("ENTROU NO CONTORLLER GET ADDRESS");

        // Busca o usuário por ID
        Optional<User> optionalUser = userService.getUserById(userId);

        //validação se o user tem permissão admin ou user autenticado é o dono do endereço e se a relação user address existe
        if (autorizationService.isAuthorized(userId, userDetails) && optionalUser.isPresent() && !userAddressService.findByUser(optionalUser.get()).isEmpty()) {
            System.out.println("User encontrado!!!!");
            User user = optionalUser.get();
            List<UserAddress> userAddress = userAddressService.findByUser(user);
            List<AddressDTO> addressDTOs = userAddress.stream().map(address -> new AddressDTO(address.getAddress().getId(), address.getAddress().getName(), address.getAddress().getCity(), address.getAddress().getStreet(), address.getAddress().getNumber(), address.getAddress().getNeighborhood(), address.getAddress().getCep(), address.getAddress().getLatitude(), address.getAddress().getLatitude())).collect(Collectors.toList());
            System.out.println("SAIU DO CONTROLLER GET ADDRESS com sucesso");
            return ResponseEntity.ok(addressDTOs);
        }else{
            System.err.println("SAIU DO CONTROLLER GET ADDRESS com erro ou sem permissão");
            return ResponseEntity.badRequest().build();
        }
    }

    //UPDATE
    @PutMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<?> editAddress(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long userId, @RequestBody @Valid AddressDTO addressDTO, UriComponentsBuilder uriComponentsBuilder) {
        System.out.println("ENTROU NO CONTORLLER PUT ADDRESS");

        //validação se o user tem permissão admin ou user autenticado é o dono do endereço e se a relação user address existe
        if (autorizationService.isAuthorized(userId, userDetails) && userAddressService.editAddress(userId, addressDTO)) {
            System.out.println("SAIU DO CONTROLLER PUT ADDRESS com sucesso");
            return ResponseEntity.ok().build();
        } else {
            System.err.println("SAIU DO CONTROLLER PUT ADDRESS com erro ou sem permissão");
            return ResponseEntity.badRequest().build();
        }
    }

    //DELETE
    //    @DeleteMapping("/address/{userId}/{addressId}")
    @DeleteMapping("/address/")
    @Transactional
    public ResponseEntity<?> deleteAddress(@AuthenticationPrincipal UserDetails userDetails, /* @PathVariable Long userId, @PathVariable Long addressId*/ @RequestParam Long userId, @RequestParam Long addressId, UriComponentsBuilder uriComponentsBuilder) {
        System.out.println("ENTROU NO CONTORLLER DELETE ADDRESS");
        Optional<User> optionalUser = userService.getUserById(userId);
        Optional<UserAddress> optionalUserAddress = userAddressService.findByUserAndAddress(optionalUser.get(), addressService.getAddressById(addressId).get());

        //validação se o user tem permissão admin ou user autenticado é o dono do endereço e se a relação user address existe
        if (autorizationService.isAuthorized(userId, userDetails) && optionalUserAddress.isPresent()) {
            userAddressService.deleteAddress(optionalUserAddress.get().getId());
            System.out.println("SAIU DO CONTROLLER DELETE ADDRESS com sucesso");
            return ResponseEntity.ok().build();
        } else {
            System.err.println("SAIU DO CONTROLLER DELETE ADDRESS com erro ou sem permissão");
            return ResponseEntity.badRequest().build();
            //TODO fazer trow execption de erros ...
//            throw new EntityNotFoundException("Erro ao remover, registro não encontrado para o id " + id);
        }

    }
}
