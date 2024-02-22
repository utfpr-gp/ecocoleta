package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.address.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
