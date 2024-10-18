package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.collect.CollectStatus;
import com.ecocoleta.backend.domain.collect.dto.CollectAddressAvaibleDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectSearchAvaibleListDTO;
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


    /**
     * Cria uma nova coleta.
     *
     * @param collectDTO Dados da coleta a ser criada.
     * @return ResponseEntity com os dados da coleta criada.
     */
    @PostMapping("create_new_collect")
    @Transactional
    public ResponseEntity createNewCollect(@RequestBody @Valid CollectDTO collectDTO) {

        var dto = collectService.createCollect(collectDTO);

        return ResponseEntity.ok().body(dto);
    }

    /**
     * Endpoint para buscar as coletas disponíveis.
     * Recebe um CollectSearchAvaibleListDTO com os parâmetros de busca.
     * Retorna uma lista de CollectAddressAvaibleDTO com as coletas disponíveis.
     */
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

    /**
     * Endpoint para finalizar coleta.
     * <p>
     * Pode receber o ID do catador e o ID da coleta.
     * Retorna um aviso que a coleta foi finalizada para o front-end.
     * Obs.: No front-end, fazer aviso sonoro, pontuação, etc.
     */
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

    /**
     * Endpoint para resetar/cancelar todas as coletas atreladas a um catador.
     * Recebe o ID do catador.
     * Retorna uma resposta indicando se as coletas foram resetadas com sucesso.
     */
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

    //TODO enpoints > para o usuario resident: pegar coletas por status como parametro e id de usuario, cancelar coleta por id coleta e user, etc...
    // endpoint de get coletas por status e id de usuario residente
    // fazer paginado
    // recebe 2 parametros: status e id de usuario, verifcica qeu tipo de user e retornar as coletas

    /**
     * Endpoint para listar coletas por status e ID de usuário.
     * Recebe o ID do usuário e o status da coleta.
     * Retorna uma lista de coletas que correspondem ao status fornecido.
     */
    @PostMapping("get_collects")
    @Transactional
    public ResponseEntity<List<CollectDTO>> getCollectsByStatus(@RequestParam @Valid Long userId, @RequestParam @Valid CollectStatus collectStatus) {
        try {
            // Busca o usuário por ID
            if (!userService.existsByid(userId)) {
                throw new ValidException("Usuário não encontrado!");
            }

            // verifica se o status é válido
            if (!collectStatus.equals(CollectStatus.PENDING) && !collectStatus.equals(CollectStatus.IN_PROGRESS) && !collectStatus.equals(CollectStatus.COMPLETED) && !collectStatus.equals(CollectStatus.CANCELLED)) {
                throw new ValidException("Status inválido!");
            }

            List<CollectDTO> collects = collectService.getCollectsByStatusAndUserId(userId, collectStatus);
            return ResponseEntity.ok().body(collects);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // endpoint de cancelar coleta por id de coleta

}
