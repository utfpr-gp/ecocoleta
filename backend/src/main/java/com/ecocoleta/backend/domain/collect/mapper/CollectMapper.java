package com.ecocoleta.backend.domain.collect.mapper;

import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.repositories.AddressRepository;
import com.ecocoleta.backend.repositories.ResidentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


//TODO mudar o mapper para o modelMapper
@Component
@RequiredArgsConstructor
public class CollectMapper {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ResidentRepository residentRepository;

//    @Autowired
    private final ModelMapper modelMapper;


    public CollectDTO toDto(Collect collect) {
        CollectDTO dto = new CollectDTO();
        dto.setId(collect.getId());
        dto.setIntern(collect.isIntern());
        dto.setSchedule(collect.getSchedule());
        dto.setPicture(collect.getPicture());
        dto.setAmount(collect.getAmount());
        dto.setStatus(collect.getStatus());
        dto.setInitTime(collect.getInitTime());
        dto.setEndTime(collect.getEndTime());
        dto.setCreateTime(collect.getCreateTime());
        dto.setUpdateTime(collect.getUpdateTime());
        dto.setAddress(collect.getAddress().getId());
        dto.setResident(collect.getResident().getId());
//        dto.setWasteCollector(collect.getWasteCollector().getId());
        return dto;
//        return modelMapper.map(collect, CollectDTO.class);
    }
    
    public Collect toEntity(CollectDTO dto) {
        Collect collect = new Collect();
//        collect.setId(dto.getId());
        collect.setIntern(dto.isIntern());
        collect.setSchedule(dto.getSchedule());
        collect.setPicture(dto.getPicture());
        collect.setAmount(dto.getAmount());
        collect.setStatus(dto.getStatus());
        collect.setInitTime(dto.getInitTime());
        collect.setEndTime(dto.getEndTime());
        collect.setCreateTime(dto.getCreateTime());
        collect.setUpdateTime(dto.getUpdateTime());
        collect.setAddress(addressRepository.findById(dto.getAddress()).get());
        collect.setResident(residentRepository.findById(dto.getResident()).get());
        return collect;
    }
}
