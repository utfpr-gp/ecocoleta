package com.ecocoleta.backend.services;

import com.ecocoleta.backend.Utils.DataUtils;
import com.ecocoleta.backend.domain.collect.dto.CollectGetAvaibleListDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectAddressAvaibleDTO;
import com.ecocoleta.backend.domain.collectMaterial.CollectMaterial;
import com.ecocoleta.backend.domain.material.Material;
import com.ecocoleta.backend.domain.material.MaterialIdDTO;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
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
import jakarta.persistence.Tuple;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.stream.Collectors; // Import necessário

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

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

        /*criação de relação entre coleta e materiais*/
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

    @Transactional
    public List<CollectAddressAvaibleDTO> getCollectAvaibleList(WasteCollector wasteCollector, CollectGetAvaibleListDTO collectGetAvaibleListDTO) {
//        Pageable pageable
        Double currentLatitude = collectGetAvaibleListDTO.currentLatitude();
        Double currentLongitude = collectGetAvaibleListDTO.currentLongitude();
//        String city = collectGetAvaibleListDTO.city();

        // Chamar o repositório para fazer a consulta
        List<Tuple> tuples = collectRepository.findAvailableCollects(currentLongitude, currentLatitude, wasteCollector.getId());
        return tuples.stream().map(tuple -> new CollectAddressAvaibleDTO(
                    tuple.get("id", Long.class),
                    tuple.get("isIntern", Boolean.class),
                    DataUtils.convertToLocalDateTime(tuple.get("schedule", Timestamp.class)),
                    tuple.get("picture", String.class),
                    tuple.get("amount", Integer.class),
                    tuple.get("status", String.class),
                    DataUtils.convertToLocalDateTime(tuple.get("createTime", Timestamp.class)),
                    DataUtils.convertToLocalDateTime(tuple.get("updateTime", Timestamp.class)),
                    tuple.get("addressId", Long.class),
                    tuple.get("residentId", Long.class),
                    tuple.get("wasteCollectorId", Long.class),
                    tuple.get("longitude", Double.class),
                    tuple.get("latitude", Double.class),
                    tuple.get("location", String.class)
//                    TODO verificar como retornar o Point
//                    DataUtils.convertToPoint(tuple.get("location", String.class))
//                    tuple.get("location", Point.class)
//                    DataUtils.convertToPoint(tuple.get("location", byte[].class)) // Conversão de binário para Point
        )).collect(Collectors.toList());
    }

//    public List<CollectDTO> convertToDTO(List<Collect> collects) {
//        return collects.stream().map(collect -> {
//            // Aqui você faz a conversão de Collect para CollectDTO
//            return new CollectDTO(collect.getId(), collect.getSchedule(), collect.getAddress(), ...);
//        }).collect(Collectors.toList());
//    }


}
