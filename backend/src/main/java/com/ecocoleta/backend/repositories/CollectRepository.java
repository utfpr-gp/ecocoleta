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
     * Busca coletas disponíveis com parâmetros de raio, limite e opção de atrelar ao wasteCollector.
     * <p>
     * Este método realiza uma consulta SQL nativa para buscar coletas disponíveis com base em:
     * - Raio geográfico especificado (`radius`) em metros.
     * - Limite máximo de registros (`limit`), definido pelo chamador.
     * - Associação condicional a um `wasteCollector` com base no parâmetro `linkToWasteCollector`.
     * <p>
     * ### Parâmetros:
     * - `longitude` (Double): Longitude do ponto de referência.
     * - `latitude` (Double): Latitude do ponto de referência.
     * - `wasteCollectorId` (Long): ID do wasteCollector que está realizando a busca (se aplicável).
     * - `radius` (Double): Raio em metros para a busca.
     * - `limit` (Integer): Limite máximo de registros retornados.
     * - `linkToWasteCollector` (Boolean): Indica se as coletas devem ser filtradas/atreladas ao wasteCollector:
     * - `true`: Retorna apenas coletas associadas ou disponíveis para o `wasteCollector`.
     * - `false`: Retorna todas as coletas disponíveis no raio, sem considerar o `wasteCollector`.
     * <p>
     * ### Comportamento:
     * - A consulta retorna as coletas disponíveis com o status `PENDING`.
     * - A condição `linkToWasteCollector` controla se a consulta considera o ID do wasteCollector.
     * - As coletas são ordenadas pela localização e limitadas pela quantidade especificada.
     * <p>
     * ### Retorno:
     * - Uma lista de `Tuple` contendo os campos selecionados (como ID, localização e status da coleta).
     * <p>
     * ### Observação:
     * - Este método aplica um limite explícito (`LIMIT :limit`) à consulta, adequado para cenários paginados.
     */
    @Query(value = "select c.id as id, c.amount as amount, " +
            "c.status as status, c.init_time as initTime, c.end_time as endTime, c.create_time as createTime, c.update_time as updateTime, " +
            "c.address_id as addressId, c.resident_id as residentId, " +
            "a.longitude as longitude, a.latitude as latitude, ST_AsText(a.location) as location " +
            "from collects c " +
            "left join address a on c.address_id = a.id " +
            "and ST_DWithin(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), a.location, :radius) " +
            "where c.status = 'PENDING' " +
            "and (:linkToWasteCollector = false or c.waste_collector_id = :wasteCollectorId or c.waste_collector_id is null) " +
            "order by a.location " +
            "limit :limit",
            nativeQuery = true)
    List<Tuple> findAvailableCollectsWithLimit(
            @Param("longitude") Double longitude,
            @Param("latitude") Double latitude,
            @Param("wasteCollectorId") Long wasteCollectorId,
            @Param("radius") Double radius,
            @Param("limit") Integer limit,
            @Param("linkToWasteCollector") boolean linkToWasteCollector);

    /**
     * Busca coletas disponíveis com parâmetros de raio e opção de atrelar ao wasteCollector, sem limite de registros.
     * <p>
     * Este método realiza uma consulta SQL nativa para buscar coletas disponíveis com base em:
     * - Raio geográfico especificado (`radius`) em metros.
     * - Associação condicional a um `wasteCollector` com base no parâmetro `linkToWasteCollector`.
     * <p>
     * ### Parâmetros:
     * - `longitude` (Double): Longitude do ponto de referência.
     * - `latitude` (Double): Latitude do ponto de referência.
     * - `wasteCollectorId` (Long): ID do wasteCollector que está realizando a busca (se aplicável).
     * - `radius` (Double): Raio em metros para a busca.
     * - `linkToWasteCollector` (Boolean): Indica se as coletas devem ser filtradas/atreladas ao wasteCollector:
     * - `true`: Retorna apenas coletas associadas ou disponíveis para o `wasteCollector`.
     * - `false`: Retorna todas as coletas disponíveis no raio, sem considerar o `wasteCollector`.
     * <p>
     * ### Comportamento:
     * - A consulta retorna todas as coletas disponíveis com o status `PENDING` dentro do raio especificado.
     * - A condição `linkToWasteCollector` controla se a consulta considera o ID do wasteCollector.
     * - As coletas são ordenadas pela localização.
     * <p>
     * ### Retorno:
     * - Uma lista de `Tuple` contendo os campos selecionados (como ID, localização e status da coleta).
     * <p>
     * ### Observação:
     * - Este método **não aplica um limite explícito** (`LIMIT`) à consulta, retornando todos os registros correspondentes.
     * - Adequado para cenários onde não há necessidade de paginação.
     */
    @Query(value = "select c.id as id, c.amount as amount, " +
            "c.status as status, c.init_time as initTime, c.end_time as endTime, c.create_time as createTime, c.update_time as updateTime, " +
            "c.address_id as addressId, c.resident_id as residentId, " +
            "a.longitude as longitude, a.latitude as latitude, ST_AsText(a.location) as location " +
            "from collects c " +
            "left join address a on c.address_id = a.id " +
            "and ST_DWithin(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), a.location, :radius) " +
            "where c.status = 'PENDING' " +
            "and (:linkToWasteCollector = false or c.waste_collector_id = :wasteCollectorId or c.waste_collector_id is null) " +
            "order by a.location",
            nativeQuery = true)
    List<Tuple> findAvailableCollectsWithoutLimit(
            @Param("longitude") Double longitude,
            @Param("latitude") Double latitude,
            @Param("wasteCollectorId") Long wasteCollectorId,
            @Param("radius") Double radius,
            @Param("linkToWasteCollector") boolean linkToWasteCollector);

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
