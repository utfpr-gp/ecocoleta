package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.ValidException;
import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.CollectStatus;
import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectResponseDTO;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.repositories.CollectRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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


    public CollectResponseDTO createCollect(CollectDTO collectDTO) {
        //TODO fazer logica de coleta, pegar objetos addres, watercollector e resident pelo id

        System.out.println("ENTROU SERVICE CREATE COLLECT");
        System.out.println(collectDTO);
        System.out.println("ID Address: " + collectDTO.idAddress());
        System.out.println("ID Resident: " + collectDTO.idResident());

        var existAddress = addressService.existsAddressById(collectDTO.idAddress());
        var existResident = residentService.existsResidentById(collectDTO.idResident());
//        var existResident = residentService.existsResidentByUserId(collectDTO.idResident());

        System.out.println("EXIST ADDRESS: " + existAddress + " EXIST RESIDENT: " + existResident);

        //LÓGICA
        if (!existAddress || !existResident) {
            System.out.println("ENTROU NO IF DE DONT !EXIST ADDRESS");
            throw new ValidException("Endereço ou Usúario invalido!");
        }

        //TODO validação for each das interfaces,...
        //validar lista de ids de amteriais
        //validar se o endereço pertence ao resident
        //validar quantidade de sacos/caixa "AMOUNT"
        /*
         * verificar se tem ou é null o wasteCollector id - pode ser opcional pois depois que sera direcionado um ctador
         * verificar se address id pertençe ao mesmo resident
         * os IDs são ids de User, pois entidade derivadas estão marcando para joinId
         *Salvar como default o enum correto de inicio da coleta
         * verificar como fazer o service do catador pegar a coleta
         *  */


//        Address address = addressService.getReferenceAddressById(collectDTO.idAddress());
//        Resident resident = residentService.getReferenceResidentById(collectDTO.idResident());
//        Collect collect = new Collect(collectDTO.is_intern(), collectDTO.picture(), collectDTO.amount(), CollectStatus.PENDING, address, resident);

        Optional<Address> addressOptional = addressService.getAddressById(collectDTO.idAddress());
        Optional<Resident> residentOptional = residentService.getResidentById(collectDTO.idResident());
//        Optional<Resident> residentOptional = residentService.getResidentByUserId(collectDTO.idResident());


        Collect collect = new Collect(collectDTO.is_intern(), collectDTO.picture(), collectDTO.amount(), CollectStatus.PENDING, addressOptional.get(), residentOptional.get());
        System.out.println("COLLECT A SER <>>criada>>: " + collect.toString());

        collectRepository.save(collect);
        System.out.println("COLLECT criada>>: " + collect.toString());


        System.out.println("to string resident .... " + residentOptional.get().getEmail());

        return new CollectResponseDTO(collect);
    }


    public void updateCollectStatus(Long collectId, CollectStatus status) {
        Collect collect = collectRepository.findById(collectId).orElseThrow(() -> new EntityNotFoundException("Collect not found"));
        collect.setStatus(status);
        collect.setUpdateTime(LocalDateTime.now());
        collectRepository.save(collect);
    }
}
