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

    //    TODO endpoints de coletas
    /**
     * Usando a API Geolocation do HTML5, o dispositivo envia a localização em longitude e latitude,
     * que serão utilizadas nos métodos para consulta e retorno de um array JSON com as 10 coletas
     * mais próximas dentro de um raio especificado.
     *
     * A API Leaflet do front-end monta os locais no mapa usando esse array.
     *
     * A cada 1 minuto ou 30 segundos, verifica-se a localização atual e se ela está em um dos pontos
     * indicados no mapa. Caso positivo, a coleta realizada é enviada para o back-end para posterior avaliação.
     *
     * Para o cálculo e consulta pelo raio, utilizar o cálculo de Haversine.
     *
     * Criar DTO que recebe:
     * - idWasteCollector
     * - longitude
     * - latitude
     * - city
     *
     *
     * Endpoint:
     * O endpoint chama o serviço que fará a seleção das coletas, onde pega as 10 primeiras coletas que baterem com o metodo de calculo de haversine, filtrando pela cidade e status pending.
     *
     *
     * Front:
     * Com a API Geolocation, pega as coordenadas e a cidade atual, e as envia para a API.
     * Ao receber a lista das 10 coletas, monta os locais no mapa.
     * O serviço do front-end, após receber a lista, deve verificar a cada 1 minuto se a localização
     * atual está aproximadamente a 10 metros (+/-) de uma das coletas em execução.
     *
     *
     * Precisão: Armazene as coordenadas com a precisão adequada (geralmente, DECIMAL(9, 6) para latitude e longitude).
     * Validação: Valide as coordenadas antes de salvar (latitude entre -90 e 90, longitude entre -180 e 180).
     *
     * Usar POSTGIS - lib do postgres para localização geoespacial em banco.
     */


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


//    @PostMapping("/{userId}")
//    @Transactional
//    public ResponseEntity<List<CollectDTO>> getCollects(@PathVariable Long userId, @RequestBody @Valid CollectGetDTO collectGetDTO) {
//
//        // Busca o usuário por ID
//        if (!wasteCollectorService.existsWasteCollectorById(userId)){
//            throw new ValidException("Catador não encontrado!");
//        }
//
//
//        WasteCollector wasteCollector =  wasteCollectorService.getWasteCollectorById(userId).get();
//
//        var returnDto = collectService.getCollectAvaibleList(wasteCollector, collectGetDTO);
//
//        return ResponseEntity.ok().body(returnDto);
//
//    }

    //solicitação de coleta, delete, etc...
}
