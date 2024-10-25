package com.ecocoleta.backend.domain.collect.mapper;

import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.repositories.AddressRepository;
import com.ecocoleta.backend.repositories.ResidentRepository;
import com.ecocoleta.backend.repositories.WasteCollectorRespository;
//TODO mudar o mapper para o modelMapper
public class CollectMapper {

    private final AddressRepository addressRepository;
    private final ResidentRepository residentRepository;
    private final WasteCollectorRespository wasteCollectorRespository;

    // Injeta os repositórios via construtor
    public CollectMapper(AddressRepository addressRepository,
                         ResidentRepository residentRepository,
                         WasteCollectorRespository wasteCollectorRepository) {
        this.addressRepository = addressRepository;
        this.residentRepository = residentRepository;
        this.wasteCollectorRespository = wasteCollectorRepository;
    }


    // Converte de entidade para DTO
    public static CollectDTO toDto(Collect collect) {
        CollectDTO dto = new CollectDTO(
                collect.getId(),
                collect.isIntern(),
                collect.getSchedule(),
                collect.getPicture(),
                collect.getAmount(),
                collect.getStatus(),  // Converte enum para string
                collect.getInitTime(),
                collect.getEndTime(),
                collect.getCreateTime(),
                collect.getUpdateTime(),
                collect.getAddress() != null ? collect.getAddress().getId() : null,
                collect.getResident() != null ? collect.getResident().getId() : null,
                collect.getWasteCollector() != null ? collect.getWasteCollector().getId() : null,
                null  // materials
        );
        return dto;
    }

    // Converte de DTO para entidade
    public Collect toEntity(CollectDTO dto) {
        Collect collect = new Collect();
        collect.setId(dto.id());
        collect.setIntern(dto.is_intern());
        collect.setSchedule(dto.schedule());
        collect.setPicture(dto.picture());
        collect.setAmount(dto.amount());
        collect.setStatus(dto.status());
//        collect.setStatus(CollectStatus.valueOf(String.valueOf(dto.status())));  // Converte string para enum
        collect.setInitTime(dto.initTime());
        collect.setEndTime(dto.endTime());
        collect.setCreateTime(dto.createTime());
        collect.setUpdateTime(dto.updateTime());
        // O Address, Resident e WasteCollector precisam ser recuperados a partir dos IDs
        // Isso pode ser feito num Service ou Repository
        // Recupera as entidades relacionadas a partir dos repositórios
        if (dto.idAddress() != null) {
            collect.setAddress(addressRepository.findById(dto.idAddress()).orElse(null));
        }

        if (dto.idResident() != null) {
            collect.setResident(residentRepository.findById(dto.idResident()).orElse(null));
        }

        if (dto.idWasteCollector() != null) {
            collect.setWasteCollector(wasteCollectorRespository.findById(dto.idWasteCollector()).orElse(null));
        }

        return collect;
    }
}

