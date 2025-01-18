package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.services.AutorizationService;
import com.ecocoleta.backend.services.UserAddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("myaccount")
public class MyAccountController {

    @Autowired
    AutorizationService autorizationService;

    @Autowired
    UserAddressService userAddressService;

    //TODO  metodo myacont/id para pegar dados do usuario

    //Metodos de Address>>>>>
    @GetMapping("/{userId}/addresses")
    public ResponseEntity<List<AddressDTO>> getAddresses(@PathVariable Long userId) {
        return ResponseEntity.ok(userAddressService.getAddressList(userId));
    }

    @GetMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<AddressDTO> getSpecificAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId,
            @AuthenticationPrincipal UserDetails userDetails) {
        autorizationService.isAuthorized(userId, userDetails);
        return ResponseEntity.ok(userAddressService.getSpecificAddress(userId, addressId));
    }

    @PostMapping("/{userId}/addresses")
    public ResponseEntity<Void> createAddress(@PathVariable Long userId, @RequestBody @Valid AddressDTO addressDTO) {
        userAddressService.createAddress(userId, addressDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/addresses")
    public ResponseEntity<Void> updateAddress(@PathVariable Long userId, @RequestBody @Valid AddressDTO addressDTO) {
        userAddressService.updateAddress(userId, addressDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long userId, @PathVariable Long addressId) {
        userAddressService.deleteAddress(userId, addressId);
        return ResponseEntity.ok().build();
    }
}
