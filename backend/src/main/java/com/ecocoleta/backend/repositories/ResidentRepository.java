package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.resident.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, Long> {
//
//    boolean existsByUserId(Long userId);
//    Optional<Resident> findByUserId(Long userId);
}
