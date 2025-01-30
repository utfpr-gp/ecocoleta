package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.domain.user.dto.UserTypeCountDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repositório para operações de persistência relacionadas aos usuários.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    UserDetails findByEmail(String email);

    User findUserByEmailIs(String email);

    Page<User> findAllByActivoTrue(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role")
    Page<User> findAllByRole(@Param("role") UserRole role, Pageable pageable);

    /**
     * Conta a quantidade de usuários por tipo (Resident, WasteCollector, Company).
     *
     * @return Lista de UserTypeCountDTO com a contagem de usuários por tipo.
     */
    @Query("SELECT new com.ecocoleta.backend.domain.user.dto.UserTypeCountDTO(u.role, COUNT(u)) " +
            "FROM User u GROUP BY u.role")
    List<UserTypeCountDTO> countUsersByRole();
}
