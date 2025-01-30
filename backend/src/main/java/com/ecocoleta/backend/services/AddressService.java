package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.repositories.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public Optional<Address> getAddressById(Long id) {
        return addressRepository.findById(id);
    }

    public boolean existsAddressById(Long id) {
        return addressRepository.existsById(id);
    }

    public Address getReferenceAddressById(Long id) {
        return addressRepository.getReferenceById(id);
    }
}