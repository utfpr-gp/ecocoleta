package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.collect.Collect;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectRepository extends JpaRepository<Collect, Long> {
}
