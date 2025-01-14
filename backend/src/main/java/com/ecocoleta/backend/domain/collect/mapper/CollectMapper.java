package com.ecocoleta.backend.domain.collect.mapper;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.repositories.AddressRepository;
import com.ecocoleta.backend.repositories.ResidentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class CollectMapper {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ResidentRepository residentRepository;

    private final ModelMapper modelMapper;


    public CollectDTO toDto(Collect collect) {
        return new CollectDTO(
                collect.getId(),
                collect.isIntern(),
                collect.getSchedule(),
                collect.getPicture(),
                collect.getAmount(),
                collect.getStatus(),
                collect.getInitTime(),
                collect.getEndTime(),
                collect.getCreateTime(),
                collect.getUpdateTime(),
                collect.getAddress().getId(),
                collect.getResident().getId(),
                collect.getWasteCollector() != null ? collect.getWasteCollector().getId() : null,
                collect.getMaterials()
                );
    }

    public Collect toEntity(CollectDTO dto) {
        Address address = addressRepository.findById(dto.address())
                .orElseThrow(() -> new ValidException("Endereço não encontrado: " + dto.address()));

        Resident resident = residentRepository.findById(dto.resident())
                .orElseThrow(() -> new ValidException("Residente não encontrado: " + dto.resident()));

        return new Collect(
                dto.isIntern(),
                dto.picture(),
                dto.amount(),
                address,
                resident,
                dto.materials() // Lista de materiais
        );
    }

}
