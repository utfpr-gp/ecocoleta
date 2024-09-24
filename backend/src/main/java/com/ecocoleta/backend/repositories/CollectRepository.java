package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.collect.dto.CollectReturnAvaibleDTO;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
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

    // TODO fazer query para pegar pelo longitude perot de 5 km
    /*
     * Filtro de cidade: O campo c.address.city é comparado com a cidade fornecida no DTO.
     * Distância geoespacial: A função ST_DistanceSphere do PostGIS calcula a distância esférica entre o ponto de coleta e as coordenadas atuais do coletor, limitando as coletas a 5 km.
     * Filtro por status PENDING: As coletas retornadas devem ter o status CollectStatus.PENDING.
     * Associação opcional ao WasteCollector: Coletas que ainda não têm um coletor atribuído (ou já estão atribuídas ao coletor atual) são selecionadas.
     * Limitação de resultados: A consulta é limitada a 10 resultados.
     */

//    @Query("select c, a.longitude, a.latitude, a.location from Collect c left join Address a on c.address = a and ST_DWithin(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), a.location, 5000) where c.status = 'PENDING' and (c.wasteCollector is null or c.wasteCollector = :wasteCollector) order by a.location limit 10")
//    List<Collect> findAvailableCollects(@Param("city") String city,
//                                        @Param("wasteCollector") WasteCollector wasteCollector,
//                                        @Param("longitude") Double longitude,
//                                        @Param("latitude") Double latitude);

    @Query(value = "select c.*, a.longitude, a.latitude, a.location " +
            "from collects c " +
            "left join address a on c.address_id = a.id " +
            "and ST_DWithin(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), a.location, 5000) " +
            "where c.status = 'PENDING' " +
            "and (c.waste_collector_id is null or c.waste_collector_id = :wasteCollectorId) " +
            "order by a.location " +
            "limit 10",
            nativeQuery = true)
    List<CollectReturnAvaibleDTO> findAvailableCollects(@Param("longitude") Double longitude,
                                                        @Param("latitude") Double latitude,
                                                        @Param("wasteCollectorId") Long wasteCollectorId);

}
