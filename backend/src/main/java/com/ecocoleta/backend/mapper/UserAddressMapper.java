//package com.ecocoleta.backend.mapper;
//
//import com.ecocoleta.backend.domain.userAddress.UserAddress;
//import com.ecocoleta.backend.domain.userAddress.UserAddressDTO;
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//
//@Component
//public class UserAddressMapper {
//
//    @Autowired
//    private ModelMapper mapper;
//
//    public UserAddressDTO toDTO(UserAddress entity) {
//        return mapper.map(entity, UserAddressDTO.class);
//    }
//
//    public UserAddress toEntity(UserAddressDTO dto) {
//        return mapper.map(dto, UserAddress.class);
//    }
//
//}
