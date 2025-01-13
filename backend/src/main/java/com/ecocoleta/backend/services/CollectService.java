package com.ecocoleta.backend.services;

import com.ecocoleta.backend.Utils.DataUtils;
import com.ecocoleta.backend.domain.collect.dto.CollectSearchAvaibleListDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectAddressAvaibleDTO;
import com.ecocoleta.backend.domain.collect.mapper.CollectMapper;
import com.ecocoleta.backend.domain.collectMaterial.CollectMaterial;
import com.ecocoleta.backend.domain.material.Material;
import com.ecocoleta.backend.domain.material.MaterialIdDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.CollectStatus;
import com.ecocoleta.backend.domain.collect.dto.CollectDTO;
import com.ecocoleta.backend.domain.collect.dto.CollectNewResponseDTO;
import com.ecocoleta.backend.repositories.AddressRepository;
import com.ecocoleta.backend.repositories.CollectMaterialRepository;
import com.ecocoleta.backend.repositories.CollectRepository;
import com.ecocoleta.backend.repositories.ResidentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Tuple;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
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

        if (!addressRepository.existsById(collectDTO.address()) && !residentRepository.existsById(collectDTO.resident())) {
            throw new ValidException("Id Address ou Resident informado não existe");
        }
        Collect collect = collectMapper.toEntity(collectDTO);

        collectRepository.save(collect);

//        TODO recebe uma lista de enum de materiais

//        TODO mudar para embbeded o materials em vez de relação nxn, assim fica uma lista dentro de collect e não precisa de relação direta com materials
//        /*criação de relação entre coleta e materiais*/
//        if (!collectDTO.materials().isEmpty()) {
//            for (MaterialIdDTO materialId : collectDTO.materials()) {
//                Material material = materialService.getMaterialById(materialId.id()).orElseThrow(() -> new ValidException("Material not found"));
//                CollectMaterial collectMaterial = new CollectMaterial(collect, material);
//                collectMaterialRepository.save(collectMaterial);
//            }
//        }


//        return new CollectNewResponseDTO(collect);

        //TODO collectMapper de retorno para DTO
        return collectMapper.toDto(collect);
    }


    public void updateCollectStatus(Long collectId, CollectStatus status) {
        Collect collect = collectRepository.findById(collectId).orElseThrow(() -> new EntityNotFoundException("Coleta não encontrada"));
        collect.setStatus(status);
        collect.setUpdateTime(LocalDateTime.now());
        collectRepository.save(collect);
    }

    /**
     * Obtém uma lista de coletas disponíveis com base nos critérios fornecidos.
     *
     * @param collectSearchAvaibleListDTO Dados de busca para coletas disponíveis.
     * @return Lista de coletas disponíveis.
     */
    @Transactional
    public List<CollectAddressAvaibleDTO> getCollectAvaibleList(CollectSearchAvaibleListDTO collectSearchAvaibleListDTO) {
        Double currentLatitude = collectSearchAvaibleListDTO.currentLatitude();
        Double currentLongitude = collectSearchAvaibleListDTO.currentLongitude();
        Long wasteCollectorId = collectSearchAvaibleListDTO.idWasteCollector();

        // Chamar o repositório para fazer a consulta
        List<Tuple> tuples = collectRepository.findAvailableCollects(currentLongitude, currentLatitude, wasteCollectorId);

        LocalDateTime now = LocalDateTime.now();

        // Marcar as coletas com o wasteCollectorId, status e initTime
        tuples.forEach(tuple -> {
            Collect collect = collectRepository.findById(tuple.get("id", Long.class)).orElseThrow(() -> new EntityNotFoundException("Collect not found"));
            /*if (collect.getWasteCollector() != null && !Objects.equals(collect.getWasteCollector().getId(), wasteCollectorId)) {
                throw new ValidException("Collect already reserved");
            }*/
            collect.setWasteCollector(wasteCollectorService.getWasteCollectorById(wasteCollectorId).orElseThrow(() -> new EntityNotFoundException("WasteCollector not found")));
            collect.setInitTime(now);
            collect.setStatus(CollectStatus.IN_PROGRESS);
            collectRepository.save(collect);
        });

        // Retono da lista de Tuple para a lista de CollectAddressAvaibleDTO
        return tuples.stream().map(tuple -> new CollectAddressAvaibleDTO(
                tuple.get("id", Long.class),
                tuple.get("isIntern", Boolean.class),
                DataUtils.convertToLocalDateTime(tuple.get("schedule", Timestamp.class)),
                tuple.get("picture", String.class),
                tuple.get("amount", Integer.class),
                tuple.get("status", String.class),
                DataUtils.convertToLocalDateTime(tuple.get("initTime", Timestamp.class)),
                DataUtils.convertToLocalDateTime(tuple.get("endTime", Timestamp.class)),
                DataUtils.convertToLocalDateTime(tuple.get("createTime", Timestamp.class)),
                DataUtils.convertToLocalDateTime(tuple.get("updateTime", Timestamp.class)),
                tuple.get("addressId", Long.class),
                tuple.get("residentId", Long.class),
                tuple.get("wasteCollectorId", Long.class),
                tuple.get("longitude", Double.class),
                tuple.get("latitude", Double.class),
                tuple.get("location", String.class)
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
        if (collect.getWasteCollector() == null || !Objects.equals(collect.getWasteCollector().getId(), collectDTO.wasteCollector())) {
            throw new ValidException("Coleta não encontrada ou não pertence ao usuario");
        }

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
        List<Collect> ongoingCollects = collectRepository.findAllOngoingCollectsByWasteCollectorId(wasteCollectorId, CollectStatus.IN_PROGRESS.name());
        if (ongoingCollects.isEmpty()) {
            return false;
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

    /**
     * Obtém uma lista de coletas por status e ID de usuário.
     *
     * @param userId        ID do usuário.
     * @param collectStatus Status da coleta.
     * @return Lista de coletas que correspondem ao status fornecido.
     */
    public List<CollectDTO> getCollectsByStatusAndUserId(Long userId, CollectStatus collectStatus, Pageable pageable) {

        // Obtém o usuário pelo ID
        Optional<User> user = userService.getUserById(userId);

        // Verifica o papel do usuário
        if (user.isPresent()) {
            List<Collect> collects;

            if (user.get().getRole() == UserRole.RESIDENT) {
                collects = collectRepository.findCollectsByStatusAndResidentId(collectStatus, userId, pageable);
            } else if (user.get().getRole() == UserRole.WASTE_COLLECTOR) {
                collects = collectRepository.findCollectsByStatusAndWasteCollectorId(collectStatus, userId, pageable);
            } else {
                return null;  // Caso o usuário não seja nem residente nem coletor
            }

            // Mapeia a lista de entidades `Collect` para `CollectDTO` usando o CollectMapper
            return collects.stream()
                    .map(collectMapper::toDto)
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
}
