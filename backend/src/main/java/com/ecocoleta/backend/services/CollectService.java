package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.collectMaterial.CollectMaterial;
import com.ecocoleta.backend.domain.material.Material;
import com.ecocoleta.backend.domain.material.MaterialIdDTO;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.CollectStatus;
import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectResponseDTO;
import com.ecocoleta.backend.repositories.AddressRepository;
import com.ecocoleta.backend.repositories.CollectMaterialRepository;
import com.ecocoleta.backend.repositories.CollectRepository;
import com.ecocoleta.backend.repositories.ResidentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CollectService {

    @Autowired
    private CollectRepository collectRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private CollectMaterialRepository collectMaterialRepository;

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

        if (!addressRepository.existsById(collectDTO.idAddress()) && !residentRepository.existsById(collectDTO.idResident())) {
            throw new ValidException("Id Address ou Resident informado não existe");
        }

        var address = addressRepository.findById(collectDTO.idAddress()).get();
        var resident = residentRepository.findById(collectDTO.idResident()).get();

        Collect collect = new Collect(collectDTO.is_intern(), collectDTO.picture(), collectDTO.amount(), CollectStatus.PENDING, address, resident);

        collectRepository.save(collect);

//        #TODO continuar debugar e como salvar aqui collectmaterial
        //        validação de materiais
        if(!collectDTO.materials().isEmpty()){

            for (MaterialIdDTO materialId : collectDTO.materials()) {

                Material material = materialService.getMaterialById(materialId.id()).orElseThrow(() -> new ValidException("Material not found"));

                CollectMaterial collectMaterial = new CollectMaterial(collect, material);

                collectMaterialRepository.save(collectMaterial);
            }
        }


        return new CollectResponseDTO(collect);
    }


    public void updateCollectStatus(Long collectId, CollectStatus status) {
        Collect collect = collectRepository.findById(collectId).orElseThrow(() -> new EntityNotFoundException("Collect not found"));
        collect.setStatus(status);
        collect.setUpdateTime(LocalDateTime.now());
        collectRepository.save(collect);
    }
}
