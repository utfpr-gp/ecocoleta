package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.userAddress.UserAddress;
import com.ecocoleta.backend.infra.exception.ValidException;
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

    //Metodos de Address>>>>>
    // CREATE Address
    @PostMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<Void> createAddress(@PathVariable Long userId, @RequestBody @Valid AddressDTO addressDTO) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new ValidException("Usuário não encontrado para o ID: " + userId));

        Address address = new Address(
                addressDTO.name(), addressDTO.city(), addressDTO.street(),
                addressDTO.number(), addressDTO.neighborhood(), addressDTO.cep(),
                addressDTO.latitude(), addressDTO.longitude()
        );
        UserAddress userAddress = new UserAddress(user, address);

        if (userAddressService.createAddress(userAddress)) {
            return ResponseEntity.ok().build();
        } else {
            throw new ValidException("Erro ao criar endereço. Verifique os dados e tente novamente.");
        }
    }

    // GET Address
    @GetMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<List<AddressDTO>> getAddress(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new ValidException("Usuário não encontrado para o ID: " + userId));

        if (!autorizationService.isAuthorized(userId, userDetails)) {
            throw new ValidException("Acesso negado ao recurso solicitado.");
        }

        List<AddressDTO> addressDTOs = userAddressService.findByUser(user).stream()
                .map(userAddress -> new AddressDTO(
                        userAddress.getAddress().getId(),
                        userAddress.getAddress().getName(),
                        userAddress.getAddress().getCity(),
                        userAddress.getAddress().getStreet(),
                        userAddress.getAddress().getNumber(),
                        userAddress.getAddress().getNeighborhood(),
                        userAddress.getAddress().getCep(),
                        userAddress.getAddress().getLatitude(),
                        userAddress.getAddress().getLongitude()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(addressDTOs);
    }

    // UPDATE Address
    @PutMapping("/address/{userId}")
    @Transactional
    public ResponseEntity<Void> editAddress(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long userId, @RequestBody @Valid AddressDTO addressDTO) {
        if (!autorizationService.isAuthorized(userId, userDetails)) {
            throw new ValidException("Acesso negado ao recurso solicitado.");
        }

        if (userAddressService.editAddress(userId, addressDTO)) {
            return ResponseEntity.ok().build();
        } else {
            throw new ValidException("Erro ao atualizar o endereço. Verifique os dados e tente novamente.");
        }
    }

    // DELETE Address
    @DeleteMapping("/address")
    @Transactional
    public ResponseEntity<Void> deleteAddress(@AuthenticationPrincipal UserDetails userDetails, @RequestParam Long userId, @RequestParam Long addressId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new ValidException("Usuário não encontrado para o ID: " + userId));

        Address address = addressService.getAddressById(addressId)
                .orElseThrow(() -> new ValidException("Endereço não encontrado para o ID: " + addressId));

        UserAddress userAddress = userAddressService.findByUserAndAddress(user, address)
                .orElseThrow(() -> new ValidException("Relacionamento entre usuário e endereço não encontrado."));

        if (!autorizationService.isAuthorized(userId, userDetails)) {
            throw new ValidException("Acesso negado ao recurso solicitado.");
        }

        userAddressService.deleteAddress(userAddress.getId());
        return ResponseEntity.ok().build();
    }
}
