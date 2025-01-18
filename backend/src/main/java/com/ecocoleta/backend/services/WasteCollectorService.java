package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.domain.wasteCollector.dto.WasteCollectorLocationDTO;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.repositories.WasteCollectorRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Coordinate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WasteCollectorService {

    @Autowired
    private WasteCollectorRespository wasteCollectorRespository;

    public Optional<WasteCollector> getWasteCollectorById(Long id) {
        return wasteCollectorRespository.findById(id);
    }

    public boolean existsWasteCollectorById(Long id) {
        return wasteCollectorRespository.existsById(id);
    }

    public WasteCollector getReferenceWasteCollectorById(Long id) {
        return wasteCollectorRespository.getReferenceById(id);
    }

    public List<WasteCollectorLocationDTO> getRecentLocations() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(30);
        return wasteCollectorRespository.findRecentLocations(threshold).stream()
                .map(collector -> new WasteCollectorLocationDTO(
                        collector.getId(),
                        collector.getLocation().getY(),
                        collector.getLocation().getX()))
                .toList();
    }

    //    public void updateLocation(WasteCollectorLocationDTO locationDTO) {
//        GeometryFactory geometryFactory = new GeometryFactory();
//        WasteCollector collector = wasteCollectorRespository.findById(locationDTO.collectorId())
//                .orElseThrow(() -> new ValidException("Catador não encontrado"));
//
//        // Criar o ponto com fábrica de geometria
//        collector.setLocation(geometryFactory.createPoint(new Coordinate(locationDTO.longitude(), locationDTO.latitude())));
//        collector.setLocationUpdated(LocalDateTime.now());
//        wasteCollectorRespository.save(collector);
//    }
    public void updateLocation(WasteCollectorLocationDTO locationDTO) {
        WasteCollector collector = wasteCollectorRespository.findById(locationDTO.collectorId())
                .orElseThrow(() -> new ValidException("Catador não encontrado"));

        // Chama o método da entidade para atualizar a localização
        collector.updateLocation(locationDTO.longitude(), locationDTO.latitude());

        // Salva o catador atualizado
        wasteCollectorRespository.save(collector);
    }

}
