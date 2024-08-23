package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.collectMaterial.CollectMaterial;
import com.ecocoleta.backend.domain.material.Material;
import com.ecocoleta.backend.domain.material.MaterialDTO;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.CollectStatus;
import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectResponseDTO;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.repositories.CollectRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CollectService {

    @Autowired
    private CollectRepository collectRepository;

    @Autowired
    private AddressService addressService;

    @Autowired
    private ResidentService residentService;

    @Autowired
    private WasteCollectorService wasteCollectorService;

    @Autowired
    private MaterialService materialService;


    public CollectResponseDTO createCollect(CollectDTO collectDTO) {
        System.out.println("ENTROU SERVICE CREATE COLLECT");

        Optional<Address> address = addressService.getAddressById(collectDTO.idAddress());
//                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        Optional<Resident> resident = residentService.getResidentById(collectDTO.idResident());
//                .orElseThrow(() -> new ResourceNotFoundException("Resident not found"));
        Optional<WasteCollector> wasteCollector = wasteCollectorService.getWasteCollectorById(collectDTO.idWasteCollector());
//                .orElse(null); // WasteCollector pode ser opcional

        Collect collect = new Collect(collectDTO.is_intern(), collectDTO.picture(), collectDTO.amount(), CollectStatus.PENDING, address.get(), resident.get());


        for (MaterialDTO materialId : collectDTO.materials()) {

            Material material = materialService.getMaterialById(materialId.id()).orElseThrow(() -> new ValidException("Material not found"));

            CollectMaterial collectMaterial = new CollectMaterial(collect, material);
//        #TODO fazer relação do materias com coleta
//            if (userAddressService.createAddress(userAddress)) {

        }

        collectRepository.save(collect);

        return new CollectResponseDTO(collect);
    }


    public void updateCollectStatus(Long collectId, CollectStatus status) {
        Collect collect = collectRepository.findById(collectId).orElseThrow(() -> new EntityNotFoundException("Collect not found"));
        collect.setStatus(status);
        collect.setUpdateTime(LocalDateTime.now());
        collectRepository.save(collect);
    }
}
