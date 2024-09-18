package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.collect.Collect;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.locationtech.jts.geom.Point;

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
//    @Query(value = "SELECT c FROM Collect c " +
//            "WHERE c.status = 'PENDING' " +
//            "AND c.address.city = :city " +
//            "AND ST_DistanceSphere(c.address.location, :collectorLocation) <= 5000 " +  // Filtro por raio de 5 km
//            "AND (c.wasteCollector IS NULL OR c.wasteCollector = :wasteCollector) " +  // Coletas disponíveis ou associadas ao coletor
//            "ORDER BY c.schedule ASC " +  // Ordenar por data de agendamento
//            "LIMIT 10")  // Limitar a 10 resultados
//    List<Collect> findAvailableCollects(String city, Point collectorLocation, WasteCollector wasteCollector);
//    @Query("SELECT c FROM Collect c " +
//            "WHERE c.status = 'PENDING' " +
//            "AND c.address.city = :city " +
//            "AND FUNCTION('ST_DistanceSphere', c.address.location::geography, :collectorLocation::geography) <= 5000 " +  // Filtro por raio de 5 km
//            "AND (c.wasteCollector IS NULL OR c.wasteCollector = :wasteCollector) " +  // Coletas disponíveis ou associadas ao coletor
//            "ORDER BY c.schedule ASC")
//    List<Collect> findAvailableCollects(String city, Point collectorLocation, WasteCollector wasteCollector);

    @Query("SELECT c FROM Collect c " +
            "WHERE c.status = 'PENDING' " +
            "AND c.address.city = :city " +
            "AND ST_Distance(c.address.location, :collectorLocation) <= 5000 " +
            "AND (c.wasteCollector IS NULL OR c.wasteCollector = :wasteCollector) " +
            "ORDER BY c.schedule ASC")
    List<Collect> findAvailableCollects(String city, Point collectorLocation, WasteCollector wasteCollector);


}
