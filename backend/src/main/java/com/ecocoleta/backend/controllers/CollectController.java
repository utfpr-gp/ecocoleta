package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.collect.CollectStatus;
import com.ecocoleta.backend.domain.collect.dto.CollectAddressAvaibleDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectSearchAvaibleListDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.repositories.WasteCollectorRespository;
import com.ecocoleta.backend.services.AutorizationService;
import com.ecocoleta.backend.services.CollectService;
import com.ecocoleta.backend.services.UserService;
import com.ecocoleta.backend.services.WasteCollectorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    @Autowired
    private AutorizationService autorizationService;


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

    //    TODO rota de upodate de coleta??? ou é melhor fazer um cancelamento e criar uma nova coleta?

    @GetMapping("/active_collects")
    public ResponseEntity<Page<CollectDTO>> getActiveCollects(@RequestParam @Valid Long userId,
                                                              @PageableDefault(size = 10, sort = {"createTime"}, direction = Sort.Direction.DESC) Pageable pageable) {
        List<CollectStatus> statuses = List.of(
                CollectStatus.PENDING, CollectStatus.PAUSED, CollectStatus.IN_PROGRESS, CollectStatus.COMPLETED
        );

        Page<CollectDTO> collects = collectService.getCollectsByStatusesAndEvaluation(userId, statuses, false, pageable);

        return ResponseEntity.ok(collects); // Retorna o objeto paginado diretamente
    }

    @GetMapping("/history_collects")
    public ResponseEntity<Page<CollectDTO>> getHistoryCollects(@RequestParam @Valid Long userId,
                                                               @RequestParam(required = false) CollectStatus collectStatus,
                                                               @PageableDefault(size = 10, sort = {"id"}) Pageable pageable) {
        // Se nenhum status for informado, buscar "COMPLETED" e "CANCELLED"
        List<CollectStatus> statuses = (collectStatus != null) ?
                List.of(collectStatus) : List.of(CollectStatus.COMPLETED, CollectStatus.CANCELLED);

        Page<CollectDTO> collects = collectService.getCollectsByStatusesAndEvaluation(userId, statuses, null, pageable);

        return ResponseEntity.ok(collects);
    }

    /**
     * Endpoint para listar coletas por status e ID de usuário.
     * Recebe o ID do usuário e o status da coleta.
     * Retorna uma lista de coletas que correspondem ao status fornecido.
     */
    @GetMapping("get_collects")
    @Transactional
    public ResponseEntity<List<CollectDTO>> getCollectsByStatus(@RequestParam @Valid Long userId,
                                                                @RequestParam @Valid CollectStatus collectStatus,
                                                                @PageableDefault(size = 10, sort = {"id"}) Pageable pageable) {
        try {
            if (!userService.existsByid(userId)) {
                throw new ValidException("Usuário não encontrado!");
            }

            if (!isValidCollectStatus(collectStatus)) {
                throw new ValidException("Status inválido!");
            }

            List<CollectDTO> collects = collectService.getCollectsByStatusAndUserId(userId, collectStatus, pageable);
            return ResponseEntity.ok().body(collects);
        } catch (ValidException e) {
            // Retorna erro de validação com lista vazia em vez de String
            return ResponseEntity.badRequest().body(List.of()); // Retorna lista vazia ao invés de String
        } catch (Exception e) {
            // Retorna erro genérico com lista vazia
            return ResponseEntity.internalServerError().body(List.of()); // Retorna lista vazia ao invés de String
        }
    }

    /**
     * Endpoint para buscar as coletas disponíveis aos waste_collectors.
     * Recebe um CollectSearchAvaibleListDTO com os parâmetros de busca.
     * Retorna uma lista de CollectAddressAvaibleDTO com as coletas disponíveis.
     */
    @PostMapping("get_avaible_collects")
    @Transactional
    public ResponseEntity<List<CollectAddressAvaibleDTO>> getCollects(@RequestBody @Valid CollectSearchAvaibleListDTO collectSearchAvaibleListDTO) {
        if (!wasteCollectorService.existsWasteCollectorById(collectSearchAvaibleListDTO.idWasteCollector())) {
            throw new ValidException("Catador não encontrado!");
        }

        List<CollectAddressAvaibleDTO> collectAddressAvaibleDTOS = collectService.getCollectAvaibleList(collectSearchAvaibleListDTO);
        return ResponseEntity.ok().body(collectAddressAvaibleDTOS);
    }

    /**
     * Endpoint para finalizar coleta completa.
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
                throw new ValidException("Coleta não finalizada!");
            }
        } catch (ValidException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro inesperado: " + e.getMessage());
        }
    }

    /**
     * Endpoint para desistir/resetar todas as coletas atreladas a um catador.
     * Recebe o ID do catador.
     * Retorna uma resposta indicando se as coletas foram resetadas com sucesso.
     */
    @DeleteMapping("reset_collects")
    @Transactional
    public ResponseEntity resetCollects(@RequestParam @Valid Long wasteCollectorId) {
        try {
            if (collectService.resetAllCollects(wasteCollectorId)) {
                return ResponseEntity.ok().build();
            } else {
                throw new ValidException("Coletas não resetadas!");
            }
        } catch (ValidException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro inesperado: " + e.getMessage());
        }
    }

    /**
     * Endpoint para cancelar/deletar uma coleta.
     * Recebe o ID da coleta.
     * Retorna uma resposta indicando se a coleta foi deletada com sucesso.
     */
    @DeleteMapping("cancel_collect")
    @Transactional
    public ResponseEntity cancelCollect(@AuthenticationPrincipal UserDetails userDetails, @RequestParam @Valid Long collectId) {
        try {
            User user = userService.getUserByUserEmail(userDetails.getUsername());

            if (collectService.cancelCollect(collectId, user)) {
                return ResponseEntity.ok().build();
            } else {
                throw new ValidException("Coleta não cancelada!");
            }
        } catch (ValidException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro inesperado: " + e.getMessage());
        }
    }

    //TODO endpint para tornar disponivel a coleta ou indisponivel, assim deixando de lado a opção de agendar coleta, o usuario modifica o status qeu esta disponivel, ...

    /**
     * Endpoint para puasar ou ativar uma coleta tornando indisponivel naquele momento.
     * Recebe o ID da coleta.
     * Retorna uma resposta contendo o DTO da coleta indicando se a coleta foi pausada ou ativada com sucesso.
     */
    @PostMapping("paused_collect")
    @Transactional
    public ResponseEntity pausedCollect(@AuthenticationPrincipal UserDetails userDetails, @RequestParam @Valid Long collectId) {
        try {
            User user = userService.getUserByUserEmail(userDetails.getUsername());

            CollectDTO collectDTO = collectService.pausedCollect(collectId, user);
            return ResponseEntity.ok().body(collectDTO);
        } catch (ValidException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro inesperado: " + e.getMessage());
        }
    }

    // Método auxiliar para validação do status
    private boolean isValidCollectStatus(CollectStatus collectStatus) {
        return collectStatus.equals(CollectStatus.PENDING) ||
                collectStatus.equals(CollectStatus.IN_PROGRESS) ||
                collectStatus.equals(CollectStatus.COMPLETED) ||
                collectStatus.equals(CollectStatus.CANCELLED);
    }
}
