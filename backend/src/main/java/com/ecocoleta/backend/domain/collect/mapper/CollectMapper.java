package com.ecocoleta.backend.domain.collect.mapper;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.dto.CollectAddressAvaibleDTO;
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
                collect.getAmount(),
                collect.isEvaluated(),
                collect.getRating(),
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
                dto.amount(),
                address,
                resident,
                dto.materials() // Lista de materiais
        );
    }

    public CollectAddressAvaibleDTO collectAndAddresstoDto(Collect collect) {
        Address address = collect.getAddress();

        return new CollectAddressAvaibleDTO(
                collect.getId(),
                collect.getAmount(),
                collect.getStatus().toString(),
                collect.getInitTime(),
                collect.getEndTime(),
                collect.getCreateTime(),
                collect.getUpdateTime(),
                address != null ? address.getId() : null, // ID do endereço
                collect.getResident().getId(),
                collect.getWasteCollector() != null ? collect.getWasteCollector().getId() : null,
                address != null ? address.getLongitude() : null, // Longitude
                address != null ? address.getLatitude() : null,  // Latitude
                address != null && address.getLocation() != null ? address.getLocation().toString() : null,// Location
                collect.getMaterials()
                );
    }

}
