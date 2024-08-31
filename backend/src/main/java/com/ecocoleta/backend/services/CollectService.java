package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.collect.dto.CollectGetDTO;
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

//    public List<CollectDTO> getCollectAvaibleList(WasteCollector wasteCollector, CollectGetDTO collectGetDTO){
//
//        collectRepository.ge
//
//
//        return
//    }



    // TODO metodo para verificar cidade altual pela latidulde e longitude

    //    todo METODO SERVICE DE CALCULO LATIDULDE E LONGITUDE se esta procimo do addrs da coleta
    // com o metodo de ciam pega a atual cidade faz filtro no repository pegando onde o address.city é igual a atual, assim poupa varias verificações de longitude etc.
    // com as coletas ativa da cidade filtra novamente passando a latitulde e longitude e pegando as 10 primeiras que o metodo de disntancia retornar.


    /**
     * usando a api geolocation do html5 o dispositiov manda a localiaçaõ em long lat, assim ja cai nos metodos apra fazer consulta e retornar a array json com os 10 coletas no raio
     * a api do front leaflet monta os locais no mapa com a array.
     * a cada 1 min ou 30 segundos verifica a lcoalização e se esta em um dos pontos indicados no mapa, caso sim manda para o back que foi realizado a acoleta, para mais tarde ser avaliada?
     *
     */
    /

}
