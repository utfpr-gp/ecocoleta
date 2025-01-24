package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    UserDetails findByEmail(String email);

    User findUserByEmailIs(String email);

    Page<User> findAllByActivoTrue(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role")
    Page<User> findAllByRole(@Param("role") UserRole role, Pageable pageable);

}
