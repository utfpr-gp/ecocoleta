package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectSearchAvaibleListDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectAddressAvaibleDTO;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.repositories.WasteCollectorRespository;
import com.ecocoleta.backend.services.CollectService;
import com.ecocoleta.backend.services.UserService;
import com.ecocoleta.backend.services.WasteCollectorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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
     * <p>
     * A API Leaflet do front-end monta os locais no mapa usando esse array.
     * <p>
     * A cada 1 minuto ou 30 segundos, verifica-se a localização atual e se ela está em um dos pontos
     * indicados no mapa. Caso positivo, a coleta realizada é enviada para o back-end para posterior avaliação.
     * <p>
     * Para o cálculo e consulta pelo raio, utilizar o cálculo de Haversine.
     * <p>
     * Criar DTO que recebe:
     * - waste_Collector_id
     * - longitude
     * - latitude
     * - city
     * <p>
     * <p>
     * Endpoint:
     * O endpoint chama o serviço que fará a seleção das coletas, onde pega as 10 primeiras coletas que baterem com o metodo de calculo de haversine, filtrando pela cidade e status pending.
     * <p>
     * <p>
     * Front:
     * Com a API Geolocation, pega as coordenadas e a cidade atual, e as envia para a API.
     * Ao receber a lista das 10 coletas, monta os locais no mapa.
     * O serviço do front-end, após receber a lista, deve verificar a cada 1 minuto se a localização
     * atual está aproximadamente a 10 metros (+/-) de uma das coletas em execução.
     * <p>
     * <p>
     * Precisão: Armazene as coordenadas com a precisão adequada (geralmente, DECIMAL(9, 6) para latitude e longitude).
     * Validação: Valide as coordenadas antes de salvar (latitude entre -90 e 90, longitude entre -180 e 180).
     * <p>
     * Usar POSTGIS - lib do postgres para localização geoespacial em banco.
     */


    // Endpoint para buscar as coletas disponíveis
    @PostMapping("get_avaible_collects")
    @Transactional
    public ResponseEntity<List<CollectAddressAvaibleDTO>> getCollects(@RequestBody @Valid CollectSearchAvaibleListDTO collectSearchAvaibleListDTO) {

        // Busca o Catador por ID
        if (!wasteCollectorService.existsWasteCollectorById(collectSearchAvaibleListDTO.idWasteCollector())) {
            throw new ValidException("Catador não encontrado!");
        }

        List<CollectAddressAvaibleDTO> collectAddressAvaibleDTOS = collectService.getCollectAvaibleList(collectSearchAvaibleListDTO);

        return ResponseEntity.ok().body(collectAddressAvaibleDTOS);
    }

    //TODO enpoints > finalizar coleta, desistir da coleta, etc...

    /*
     * endpoint para finalizar coleta
     * pode receber o id catador, id coleta
     * retorna aviso qeu finalizou para o front
     * obs. no front fazer aviso sonoro, pontuação etc */
    @PostMapping("finish_collect")
    @Transactional
    public ResponseEntity finishCollect(@RequestBody @Valid CollectDTO collectDTO) {
        try {
            if (collectService.completedCollect(collectDTO)) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().body("Coleta não finalizada!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
//            throw new ValidException("WasteCollector not found");
        }
    }

    /*endpoint para resetar/cencelar todas as coletas atreladas a um catador */
    @PostMapping("reset_collects")
    @Transactional
    public ResponseEntity resetCollects(@RequestBody @Valid Long wasteCollectorId) {
        try {
            if (collectService.resetAllCollects(wasteCollectorId)) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().body("Coletas não resetadas!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
