package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WasteCollectorRespository  extends JpaRepository<WasteCollector, Long> {
}
