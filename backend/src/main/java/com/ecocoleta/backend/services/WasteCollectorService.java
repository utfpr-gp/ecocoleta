package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.domain.wasteCollector.dto.WasteCollectorLocationDTO;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.repositories.WasteCollectorRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<WasteCollectorLocationDTO> getRecentLocations() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(60);
        return wasteCollectorRespository.findRecentLocations(threshold).stream()
                .map(collector -> new WasteCollectorLocationDTO(
                        collector.getId(),
                        collector.getLocation().getY(),
                        collector.getLocation().getX()))
                .toList();
    }

    public void updateLocation(WasteCollectorLocationDTO locationDTO) {
        WasteCollector collector = wasteCollectorRespository.findById(locationDTO.wasteCollectorId())
                .orElseThrow(() -> new ValidException("Catador não encontrado"));

        // Chama o método da entidade para atualizar a localização
        collector.updateLocation(locationDTO.longitude(), locationDTO.latitude());

        // Salva o catador atualizado
        wasteCollectorRespository.save(collector);
    }

}
