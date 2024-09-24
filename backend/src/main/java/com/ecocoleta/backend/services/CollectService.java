package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.collect.dto.CollectGetAvaibleListDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectReturnAvaibleDTO;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public List<CollectReturnAvaibleDTO> getCollectAvaibleList(WasteCollector wasteCollector, CollectGetAvaibleListDTO collectGetAvaibleListDTO) {
//        Pageable pageable
        Double currentLatitude = collectGetAvaibleListDTO.currentLatitude();
        Double currentLongitude = collectGetAvaibleListDTO.currentLongitude();
        String city = collectGetAvaibleListDTO.city();

        // Usar GeometryFactory para criar um Point a partir das coordenadas do WasteCollector
//        GeometryFactory geometryFactory = new GeometryFactory();
//        Point currentCollectorLocation = geometryFactory.createPoint(new Coordinate(currentLongitude, currentLatitude));

        // Chamar o repositório para fazer a consulta
        List<CollectReturnAvaibleDTO> collectList = collectRepository.findAvailableCollects(currentLongitude, currentLatitude, wasteCollector.getId()); /*pageable*/
//        List<CollectDTO> collectDTOS = collectList.stream().map(collect -> new CollectDTO(collect.getId(), collect.isIntern(), collect.getSchedule(), collect.getPicture(), collect.getAmount(), collect.getAddress().getId(), collect.getResident().getId(), collect.getWasteCollector().getId(), null)).collect(Collectors.toList());

        return collectList.stream().map(collect -> new CollectReturnAvaibleDTO(collect.id(), collect.is_intern(), collect.schedule(), collect.picture(), collect.amount(), collect.status(), collect.create_time(), collect.address_id(), collect.resident_id(), collect.waste_Collector_id(), collect.longitude(), collect.latitude(), collect.location())).collect(Collectors.toList());
//        #TODO verificar retorno
        // Converter e retornar a lista de CollectDTO diretamente
//        return collects.stream()
//                .map(collect -> new CollectDTO(
//                        collect.getId(),
//                        collect.isIntern(),
//                        collect.getSchedule(),
//                        collect.getPicture(),
//                        collect.getAmount(),
//                        collect.getAddress().getId(), // Mantendo Long para address_id
//                        collect.getResident().getId(),
//                        wasteCollector.getId(), // Assumindo que você também quer incluir o WasteCollector
//                        null // Materiais ou outro campo que precise mapear
//                ))
//                .collect(Collectors.toList()); // Finaliza o stream, convertendo para uma lista
    }

//    public List<CollectDTO> convertToDTO(List<Collect> collects) {
//        return collects.stream().map(collect -> {
//            // Aqui você faz a conversão de Collect para CollectDTO
//            return new CollectDTO(collect.getId(), collect.getSchedule(), collect.getAddress(), ...);
//        }).collect(Collectors.toList());
//    }


}
