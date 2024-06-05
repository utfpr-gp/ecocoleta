package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.repositories.ResidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ResidentService {

    @Autowired
    private ResidentRepository residentRepository;

    public Optional<Resident> getResidentById(Long id) {
        return residentRepository.findById(id);
    }

//    public Optional<Resident> getResidentByUserId(Long id) {
//        return residentRepository.findByUserId(id);
//    }

    public boolean existsResidentById(Long id) {
        return residentRepository.existsById(id);
    }

//    public boolean existsResidentByUserId(Long userId) {
//        return residentRepository.existsByUserId(userId);
//    }

    public Resident getReferenceResidentById(Long id) {
        return residentRepository.getReferenceById(id);
    }

}
