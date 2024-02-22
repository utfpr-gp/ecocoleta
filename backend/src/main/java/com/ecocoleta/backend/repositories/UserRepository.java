package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    UserDetails findByEmail(String email);

    User findUserByEmailIs(String email);

    Page<User> findAllByActivoTrue(Pageable pageable);
}
