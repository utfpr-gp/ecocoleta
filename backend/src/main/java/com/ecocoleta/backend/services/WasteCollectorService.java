package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.repositories.WasteCollectorRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
