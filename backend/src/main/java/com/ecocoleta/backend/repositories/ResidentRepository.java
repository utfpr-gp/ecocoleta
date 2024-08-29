package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.resident.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, Long> {

    Optional<Resident> findByEmail(String email);

    List<Resident> findByOrderById();
}
