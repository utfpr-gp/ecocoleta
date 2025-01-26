package com.ecocoleta.backend.services;

import com.ecocoleta.backend.Utils.DataUtils;
import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.collect.CollectMaterials;
import com.ecocoleta.backend.domain.collect.dto.CollectSearchAvaibleListDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectAddressAvaibleDTO;
import com.ecocoleta.backend.domain.collect.mapper.CollectMapper;
//import com.ecocoleta.backend.domain.collectMaterial.CollectMaterial;
//import com.ecocoleta.backend.domain.material.Material;
//import com.ecocoleta.backend.domain.material.MaterialIdDTO;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.CollectStatus;
import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.repositories.AddressRepository;
import com.ecocoleta.backend.repositories.CollectRepository;
import com.ecocoleta.backend.repositories.ResidentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Tuple;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Objects;

//import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CollectService {

    @Autowired
    private CollectRepository collectRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ResidentRepository residentRepository;

//    @Autowired
//    private CollectMaterialRepository collectMaterialRepository;

    @Autowired
    private AddressService addressService;

    @Autowired
    private ResidentService residentService;

    @Autowired
    private WasteCollectorService wasteCollectorService;


    @Autowired
    private UserService userService;

    @Autowired
    private CollectMapper collectMapper;

    /**
     * Cria uma nova coleta.
     *
     * @param collectDTO Dados da coleta a ser criada.
     * @return Dados da coleta criada.
     * @throws ValidException Se o endereço ou residente não existirem.
     */
    public CollectDTO createCollect(CollectDTO collectDTO) {

        // Validação do endereço
        Address address = addressRepository.findById(collectDTO.address())
                .orElseThrow(() -> new ValidException("Endereço informado não existe: " + collectDTO.address()));

        // Validação do residente
        Resident resident = residentRepository.findById(collectDTO.resident())
                .orElseThrow(() -> new ValidException("Residente informado não existe: " + collectDTO.resident()));

        // Validação dos materiais
        if (collectDTO.materials() == null || collectDTO.materials().isEmpty()) {
            throw new ValidException("A lista de materiais não pode estar vazia.");
        }

        // Mapeamento de DTO para entidade
        Collect collect = collectMapper.toEntity(collectDTO);

        // Salvar no banco
        collectRepository.save(collect);

        // Retornar DTO
        return collectMapper.toDto(collect);
    }


    public void updateCollectStatus(Long collectId, CollectStatus status) {
        Collect collect = collectRepository.findById(collectId).orElseThrow(() -> new EntityNotFoundException("Coleta não encontrada"));
        collect.setStatus(status);
        collect.setUpdateTime(LocalDateTime.now());
        collectRepository.save(collect);
    }

    /**
     * Obtém uma lista de coletas disponíveis, opcionalmente atrelando ao wasteCollector.
     *
     * @param collectSearchAvaibleListDTO Dados de busca para coletas.
     * @param radius                      Raio de busca em metros.
     * @param limit                       Limite de resultados.
     * @param linkToWasteCollector        Indica se as coletas devem ser atreladas ao wasteCollector.
     * @return Lista de coletas disponíveis.
     */
    @Transactional
    public List<CollectAddressAvaibleDTO> getAvailableCollects(
            CollectSearchAvaibleListDTO collectSearchAvaibleListDTO,
            Double radius,
            Integer limit,
            boolean linkToWasteCollector) {

        Double currentLatitude = collectSearchAvaibleListDTO.currentLatitude();
        Double currentLongitude = collectSearchAvaibleListDTO.currentLongitude();
        Long wasteCollectorId = collectSearchAvaibleListDTO.idWasteCollector();

        if (linkToWasteCollector && !wasteCollectorService.existsWasteCollectorById(wasteCollectorId)) {
            throw new ValidException("Catador não encontrado!");
        }

        List<Tuple> tuples;
        if (limit != null) {
            tuples = collectRepository.findAvailableCollectsWithLimit(currentLongitude, currentLatitude, wasteCollectorId, radius, limit);
        } else {
            tuples = collectRepository.findAvailableCollectsWithoutLimit(
                    currentLongitude, currentLatitude, wasteCollectorId, radius, linkToWasteCollector);
        }

        LocalDateTime now = LocalDateTime.now();

        if (linkToWasteCollector) {
            tuples.forEach(tuple -> {
                Collect collect = collectRepository.findById(tuple.get("id", Long.class))
                        .orElseThrow(() -> new EntityNotFoundException("Collect not found"));
                collect.setWasteCollector(wasteCollectorService.getWasteCollectorById(wasteCollectorId)
                        .orElseThrow(() -> new EntityNotFoundException("WasteCollector not found")));
                collect.setInitTime(now);
                collect.setStatus(CollectStatus.IN_PROGRESS);
                collectRepository.save(collect);
            });
        }

        return tuples.stream().map(tuple -> new CollectAddressAvaibleDTO(
                tuple.get("id", Long.class),
                tuple.get("amount", Integer.class),
                linkToWasteCollector ? CollectStatus.IN_PROGRESS.name() : tuple.get("status", String.class), // Atualiza o status no retorno
                DataUtils.convertToLocalDateTime(tuple.get("initTime", Timestamp.class)),
                DataUtils.convertToLocalDateTime(tuple.get("endTime", Timestamp.class)),
                DataUtils.convertToLocalDateTime(tuple.get("createTime", Timestamp.class)),
                DataUtils.convertToLocalDateTime(tuple.get("updateTime", Timestamp.class)),
                tuple.get("addressId", Long.class),
                tuple.get("residentId", Long.class),
                linkToWasteCollector ? wasteCollectorId : null,
                tuple.get("longitude", Double.class) != null ? tuple.get("longitude", Double.class) : 0.0, // Trate nulo como 0.0 ou outro valor
                tuple.get("latitude", Double.class) != null ? tuple.get("latitude", Double.class) : 0.0,   // Trate nulo como 0.0 ou outro valor
                tuple.get("location", String.class),
                parseMaterials(tuple.get("materials", String.class)) // Converte a string para uma lista de materiais
        )).toList();
    }

    /**
     * Completa a coleta.
     *
     * @param collectDTO Dados da coleta a ser completada.
     * @return true se a coleta foi completada com sucesso.
     * @throws EntityNotFoundException Se a coleta não for encontrada.
     * @throws ValidException          Se a coleta não pertencer ao usuário ou já estiver finalizada.
     */
    @Transactional
    public Boolean completedCollect(CollectDTO collectDTO) {

        // Buscar a coleta pelo ID e verificar se pertence ao wasteCollectorId fornecido
        Collect collect = collectRepository.findById(collectDTO.id()).orElseThrow(() -> new EntityNotFoundException("coleta não encontrada"));
//        if (collect.getWasteCollector() == null || !Objects.equals(collect.getWasteCollector().getId(), collectDTO.wasteCollector())) {
//            throw new ValidException("Coleta não encontrada ou não pertence ao usuario");
//        }

        // Verificar se a coleta já foi finalizada
        if (CollectStatus.COMPLETED.equals(collect.getStatus())) {
            throw new ValidException("Essa coleta já foi finalizada");
        }

        // Atualizar status e endTime
        collect.setStatus(CollectStatus.COMPLETED);
        collect.setEndTime(LocalDateTime.now());
        collectRepository.save(collect);

        return true;
    }

    /**
     * Reseta todas as coletas em andamento para um catador.
     *
     * @param wasteCollectorId ID do catador de resíduos.
     * @return true se houver coletas em andamento que foram resetadas, false caso contrário.
     */
    @Transactional
    public Boolean resetAllCollects(Long wasteCollectorId) {
        // Buscar todas as coletas em andamento para o catador especificado
        List<Collect> ongoingCollects = collectRepository.findAllOngoingCollectsByWasteCollectorId(wasteCollectorId, CollectStatus.IN_PROGRESS);
        if (ongoingCollects.isEmpty()) {
            return true;
        }

        for (Collect collect : ongoingCollects) {
            // Atualizar status para pendente e remover o wasteCollectorId
            collect.setStatus(CollectStatus.PENDING);
            collect.setWasteCollector(null); // Se necessário, resetar o wasteCollectorId
            collect.setInitTime(null); // Resetar o tempo de início, se necessário
        }

        // Salvar as mudanças no banco de dados
        collectRepository.saveAll(ongoingCollects);

        return true;
    }

    public Page<CollectDTO> getCollectsByStatusesAndEvaluation(Long userId, List<CollectStatus> statuses, Boolean isEvaluated, Pageable pageable) {
        // Consulta com paginação
        Page<Collect> collects = collectRepository.findByStatusesAndEvaluation(userId, statuses, isEvaluated, pageable);

        // Converte cada entidade Collect em CollectDTO
        return collects.map(collectMapper::toDto);
    }

    /**
     * Obtém uma lista de coletas por status e ID de usuário.
     *
     * @param userId        ID do usuário.
     * @param collectStatus Status da coleta.
     * @return Lista de coletas que correspondem ao status fornecido.
     */
    public List<CollectAddressAvaibleDTO> getCollectsByStatusAndUserId(Long userId, CollectStatus collectStatus, Pageable pageable) {
        Optional<User> user = userService.getUserById(userId);

        if (user.isPresent()) {
            List<Collect> collects;

            if (user.get().getRole() == UserRole.RESIDENT) {
                collects = collectRepository.findCollectsByStatusAndResidentId(collectStatus, userId, pageable);
            } else if (user.get().getRole() == UserRole.WASTE_COLLECTOR) {
                collects = collectRepository.findCollectsByStatusAndWasteCollectorId(collectStatus, userId, pageable);
            } else {
                return null; // Usuário não é residente nem coletor
            }

            return collects.stream()
                    .map(collectMapper::collectAndAddresstoDto) // Mapper atualizado para incluir endereço
                    .collect(Collectors.toList());
        }

        return null;
    }

    /**
     * Cancela uma coleta.
     *
     * @param collectId ID da coleta a ser cancelada.
     * @param user      Usuário que está cancelando a coleta.
     * @return true se a coleta foi cancelada com sucesso.
     * @throws ValidException Se o usuário não tiver permissão para cancelar a coleta.
     */
    public boolean cancelCollect(@Valid Long collectId, User user) {

        if (user.getRole().equals(UserRole.WASTE_COLLECTOR)) {
            throw new ValidException("Catador não pode cancelar coletas");
        }

        Collect collect = collectRepository.findById(collectId).get();

        if ((collect.getResident().equals(user)) || (user.getRole().equals(UserRole.ADMIN))) {
            collect.setStatus(CollectStatus.CANCELLED);
            collectRepository.save(collect);
            return true;
        } else {
            throw new ValidException("Usuário não tem permissão para cancelar essa coleta");
        }
    }

    /**
     * Pausa e continua uma coleta.
     *
     * @param collectId ID da coleta a ser cancelada.
     * @param user      Usuário que está cancelando a coleta.
     * @return DTO da coleta atualizados.
     * @throws ValidException Se o usuário não tiver permissão para cancelar a coleta.
     */
//    TODO mudar para receber o user id e não o user
    public CollectDTO pausedCollect(@Valid Long collectId, User user) {

        if (user.getRole().equals(UserRole.WASTE_COLLECTOR)) {
            throw new ValidException("Catador não pode cancelar coletas");
        }

        Collect collect = collectRepository.findById(collectId).get();

        if ((collect.getResident().equals(user)) || (user.getRole().equals(UserRole.ADMIN))) {

            if ((collect.getStatus() != CollectStatus.PAUSED) && (collect.getStatus() != CollectStatus.CANCELLED)) {
                collect.setStatus(CollectStatus.PAUSED);
                collectRepository.save(collect);
            } else if (collect.getStatus().equals(CollectStatus.PAUSED)) {
                collect.setStatus(CollectStatus.IN_PROGRESS);
                collectRepository.save(collect);
            }

            return collectMapper.toDto(collect);
        } else {
            throw new ValidException("Usuário não tem permissão para essa coleta");
        }
    }

    private List<CollectMaterials> parseMaterials(String materials) {
        if (materials == null || materials.isBlank()) {
            return List.of();
        }
        return Arrays.stream(materials.split(","))
                .map(CollectMaterials::valueOf)
                .collect(Collectors.toList());
    }
}
