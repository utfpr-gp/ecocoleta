//package com.ecocoleta.backend.domain.resident;
//
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//
//@Component
//public class ResidentMapper {
//
//    public Resident toEntity(ResidentDTO residentDTO) {
//        if (residentDTO == null) {
//            return null;
//        }
//
//        Resident resident = new Resident();
//        resident.setName(residentDTO.name());
//        resident.setEmail(residentDTO.email());
//        resident.setPassword(residentDTO.password()); // Password should ideally be hashed before setting
//        resident.setPhone(residentDTO.phone());
//        resident.setRole(residentDTO.role());
//        resident.setCreateTime(LocalDateTime.now());
//        return resident;
//    }
//
//    public ResidentDTO toDTO(Resident resident) {
//        if (resident == null) {
//            return null;
//        }
//
//        return new ResidentDTO(
//                resident.getName(),
//                resident.getEmail(),
//                resident.getPassword(), // For security reasons, you might not want to return the password
//                resident.getPhone(),
//                resident.getRole()
//        );
//    }
//}
