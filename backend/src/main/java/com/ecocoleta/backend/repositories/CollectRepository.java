package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.CollectStatus;
import jakarta.persistence.Tuple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CollectRepository extends JpaRepository<Collect, Long> {

    Collect findCollectByAddress(Address address);

    Page<Collect> getAllByOrderByAddress(Pageable pageable);

    List<Collect> getAllByOrderById();

    List<Collect> findAllByWasteCollectorId(Long wasteCollectorId);

    List<Collect> findCollectsByStatusAndWasteCollectorId(CollectStatus status, Long wasteCollectorId, Pageable pageable);

    List<Collect> findCollectsByStatusAndResidentId(CollectStatus status, Long residentId, Pageable pageable);

    @Modifying
    @Query("UPDATE Collect c SET c.address = NULL WHERE c.address.id = :addressId")
    void updateAddressToNull(@Param("addressId") Long addressId);

    /**
     * Buscar coletas disponíveis com parâmetros de raio e limite.
     *
     * @param longitude        Longitude do coletor.
     * @param latitude         Latitude do coletor.
     * @param wasteCollectorId ID do coletor.
     * @param radius           Raio de busca em metros.
     * @param limit            Limite de resultados.
     * @return Lista de coletas disponíveis, Buscar coletas disponiveis onde calcula a distancia entre o coletor e a coleta em um raio de 3000 metros(ou parâmetro) limitando a 3 coletas(ou parâmetro) e ordenando pela localizacao, usando tupla para retornar os dados nomeados
     */
    @Query(value = "select c.id as id, c.amount as amount, " +
            "c.status as status, c.init_time as initTime, c.end_time as endTime, c.create_time as createTime, c.update_time as updateTime, " +
            "c.address_id as addressId, c.resident_id as residentId, c.waste_collector_id as wasteCollectorId, " +
            "a.longitude as longitude, a.latitude as latitude, ST_AsText(a.location) as location " +
            "from collects c " +
            "left join address a on c.address_id = a.id " +
            "and ST_DWithin(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), a.location, :radius) " +
            "where c.status = 'PENDING' " +
            "and (c.waste_collector_id = :wasteCollectorId or c.waste_collector_id is null) " +
            "order by a.location " +
            "limit :limit",
            nativeQuery = true)
    List<Tuple> findAvailableCollects(
            @Param("longitude") Double longitude,
            @Param("latitude") Double latitude,
            @Param("wasteCollectorId") Long wasteCollectorId,
            @Param("radius") Double radius,
            @Param("limit") Integer limit);


    // Pega todas as coletas pendentes que estão atrasadas
    @Query("SELECT c FROM Collect c WHERE (c.status = 'PENDING' or c.status = 'IN_PROGRESS') AND c.initTime < :sixHoursAgo")
    List<Collect> findOutdatedCollects(@Param("sixHoursAgo") LocalDateTime sixHoursAgo);

    // Pega coletas por status e avaliação
    @Query("SELECT c FROM Collect c WHERE c.resident.id = :userId AND c.status IN :statuses " +
            "AND (:isEvaluated IS NULL OR c.isEvaluated = :isEvaluated)")
    Page<Collect> findByStatusesAndEvaluation(@Param("userId") Long userId,
                                              @Param("statuses") List<CollectStatus> statuses,
                                              @Param("isEvaluated") Boolean isEvaluated,
                                              Pageable pageable);

    //Cancela todas as coletas em andamento para um catador
    @Query("SELECT c FROM Collect c WHERE c.wasteCollector.id = :wasteCollectorId AND c.status = :status")
    List<Collect> findAllOngoingCollectsByWasteCollectorId(@Param("wasteCollectorId") Long wasteCollectorId,
                                                           @Param("status") String status);

}
