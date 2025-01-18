package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WasteCollectorRespository  extends JpaRepository<WasteCollector, Long> {

    /**
     * Busca catadores com localização atualizada nos últimos minutos.
     *
     * @param threshold Tempo limite para considerar localizações recentes.
     * @return Lista de WasteCollector.
     */
    @Query("SELECT wc FROM WasteCollector wc WHERE wc.locationUpdated > :threshold")
    List<WasteCollector> findRecentLocations(@Param("threshold") LocalDateTime threshold);

    /**
     * Verifica se um catador existe pelo ID.
     *
     * @param id ID do catador.
     * @return true se o catador existe, caso contrário false.
     */
    boolean existsById(Long id);

    /**
     * Busca catadores com base na localização (raio de distância).
     *
     * @param latitude Latitude de referência.
     * @param longitude Longitude de referência.
     * @param radius Raio em metros.
     * @return Lista de WasteCollector.
     */
    @Query(value = "SELECT * FROM waste_collectors wc " +
            "WHERE ST_DWithin(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), wc.location, :radius)",
            nativeQuery = true)
    List<WasteCollector> findWithinRadius(@Param("latitude") Double latitude,
                                          @Param("longitude") Double longitude,
                                          @Param("radius") Double radius);
}
