package com.ecocoleta.backend.controllers;

import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.domain.wasteCollector.dto.WasteCollectorLocationDTO;
import com.ecocoleta.backend.services.WasteCollectorService;
import com.ecocoleta.backend.infra.exception.ValidException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("waste_collector")
public class WasteCollectorController {

    @Autowired
    private WasteCollectorService wasteCollectorService;

    /**
     * Atualiza a localização do catador.
     *
     * @param locationDTO Contém ID do catador e coordenadas (latitude e longitude).
     * @return ResponseEntity indicando sucesso ou falha.
     */
    @PostMapping("/update_location")
    @Transactional
    public ResponseEntity<Void> updateLocation(@RequestBody @Valid WasteCollectorLocationDTO locationDTO) {
        try {
            wasteCollectorService.updateLocation(locationDTO);
            return ResponseEntity.ok().build();
        } catch (ValidException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Retorna as localizações recentes dos catadores (últimos 30 minutos).
     *
     * @return Lista de WasteCollectorLocationDTO contendo informações de localização.
     */
    @GetMapping("/recent_locations")
    @Transactional(readOnly = true)
    public ResponseEntity<List<WasteCollectorLocationDTO>> getRecentLocations() {
        List<WasteCollectorLocationDTO> locations = wasteCollectorService.getRecentLocations();
        return ResponseEntity.ok(locations);
    }

    /**
     * Retorna os detalhes de um catador específico.
     *
     * @param id ID do catador.
     * @return WasteCollectorDTO contendo informações do catador.
     */
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<Optional<WasteCollector>> getCollectorById(@PathVariable Long id) {
        try {
            Optional<WasteCollector> collector = wasteCollectorService.getWasteCollectorById(id);
//            TODO passar para um dto??
            return ResponseEntity.ok(collector);
        } catch (ValidException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
