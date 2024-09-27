package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.dto.CollectAddressAvaibleDTO;
import jakarta.persistence.Tuple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
//import org.locationtech.jts.geom.Point;

import java.util.List;

@Repository
public interface CollectRepository extends JpaRepository<Collect, Long> {

    Collect findCollectByAddress(Address address);

    Page<Collect> getAllByOrderByAddress(Pageable pageable);

    List<Collect> getAllByOrderById();

    // metodo para buscar coletas disponiveis onde calcula a distancia entre o coletor e a coleta em um raio de 5000 metros limitando a 10 coletas e ordenando pela localizacao, usando tupla para retornar os dados nomeados
    @Query(value = "select c.id as id, c.is_intern as isIntern, c.schedule as schedule, c.picture as picture, c.amount as amount, " +
            "c.status as status, c.create_time as createTime, c.update_time as updateTime, " +
            "c.address_id as addressId, c.resident_id as residentId, c.waste_collector_id as wasteCollectorId, " +
            "a.longitude as longitude, a.latitude as latitude, ST_AsText(a.location) as location " +
            "from collects c " +
            "left join address a on c.address_id = a.id " +
            "and ST_DWithin(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), a.location, 5000) " +
            "where c.status = 'PENDING' " +
            "and (c.waste_collector_id is null or c.waste_collector_id = :wasteCollectorId) " +
            "order by a.location " +
            "limit 10",
            nativeQuery = true)
    List<Tuple> findAvailableCollects(@Param("longitude") Double longitude, @Param("latitude") Double latitude, @Param("wasteCollectorId") Long wasteCollectorId);
    /*
    * Query nativa para buscar coletas disponiveis
    * SELECT
            c.id as id,
            c.is_intern as isIntern,
            c.schedule as schedule,
            c.picture as picture,
            c.amount as amount,
            c.status as status,
            c.create_time as createTime,
            c.update_time as updateTime,
            c.address_id as addressId,
            c.resident_id as residentId,
            c.waste_collector_id as wasteCollectorId,
            a.longitude as longitude,
            a.latitude as latitude,
            ST_AsText(a.location) as location -- Ou use ST_AsText(a.location)
        FROM
            collects c
        LEFT JOIN
            address a ON c.address_id = a.id
        AND
            ST_DWithin(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), a.location, 5000)
        WHERE
            c.status = 'PENDING'
        AND
            (c.waste_collector_id IS NULL OR c.waste_collector_id = :wasteCollectorId)
        ORDER BY
            a.location
        LIMIT 10;
        * */
}
