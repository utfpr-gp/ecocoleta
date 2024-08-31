package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectGetDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.userAddress.UserAddress;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.repositories.WasteCollectorRespository;
import com.ecocoleta.backend.services.CollectService;
import com.ecocoleta.backend.services.UserService;
import com.ecocoleta.backend.services.WasteCollectorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("collect")
public class CollectController {

    @Autowired
    private CollectService collectService;


    @Autowired
    UserService userService;

    @Autowired
    WasteCollectorService wasteCollectorService;

    @Autowired
    private WasteCollectorRespository wasteCollectorRespository;

    //Nova coleta
    @PostMapping
    @Transactional
    public ResponseEntity createNewCollect(@RequestBody @Valid CollectDTO collectDTO) {

        var dto = collectService.createCollect(collectDTO);
        
        return ResponseEntity.ok().body(dto);
    }

//    //GET 10 COLETAS DISPONIVEIS
//    @PostMapping
//    @Transactional
//    public ResponseEntity createNewCollect(@RequestBody @Valid CollectDTO collectDTO) {
//
//        var dto = collectService.createCollect(collectDTO);
//
//        return ResponseEntity.ok().body(dto);
//    }
//    //TODO METODO DE PEGAR AS 10 COLETAS
//    ONDE RECEBE O ID DO WASTECOLLECTOR, FAZ FILTRO DAS COLETAS COM STATUS PEDENTE, ANALIZA SE A LONGITUDE E LATIDUDE ESTA PROXIMO.


    @PostMapping("/{userId}")
    @Transactional
    public ResponseEntity<List<CollectDTO>> getCollects(@PathVariable Long userId, @RequestBody @Valid CollectGetDTO collectGetDTO) {

        // Busca o usuário por ID
        if (!wasteCollectorService.existsWasteCollectorById(userId)){
            throw new ValidException("Catador não encontrado!");
        }


        WasteCollector wasteCollector =  wasteCollectorService.getWasteCollectorById(userId).get();

        var returnDto = collectService.getCollectAvaibleList(wasteCollector, collectGetDTO);

        return ResponseEntity.ok().body(returnDto);

    }

    //solicitação de coleta, delete, etc...
}
