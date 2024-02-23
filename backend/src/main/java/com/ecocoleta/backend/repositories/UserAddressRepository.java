package com.ecocoleta.backend.repositories;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserAddress;
import com.ecocoleta.backend.domain.user.UserAddressPK;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAddressRepository extends JpaRepository<UserAddress, UserAddressPK> {

    /**
     * Retorna a avaliação da especialidade de um profissional
     *
     * @param user_id
     * @param addresses_id
     * @return Optional<Integer>
     */
//    @Query("SELECT pe.rating FROM ProfessionalExpertise pe WHERE pe.professional.id = :professional_id AND pe.expertise.id = :expertise_id")
//    Optional<Integer> selectRatingByProfessionalAndExpertise(@Param("professional_id") Long professional_id, @Param("expertise_id") Long expertise_id);

    /**
     * Retorna uma userAddress de um usuário e um endereço
     *
     * @param user
     * @param address
     * @return Optional<UserAddress>
     */
    Optional<UserAddress> findByUserAndAddress(User user, Address address);

    /**
     * Retorna uma lista de endereco de um usuário
     *
     * @param user
     * @return address
     */

    List<UserAddress> findByUser(User user);


    /**
     * Retorna uma lista de usuário de um endereço
     *
     * @param address
     * @return user
     */
    List<UserAddress> findByAddress(Address address);

}
