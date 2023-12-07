package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.resident.Resident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResidentRepository extends JpaRepository<Resident, Long> {
}
