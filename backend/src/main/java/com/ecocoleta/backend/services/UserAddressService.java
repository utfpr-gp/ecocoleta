package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.user.UserAddress;
import com.ecocoleta.backend.repositories.UserAddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAddressService {

    @Autowired
    private UserAddressRepository userAddressRepository;

//    public Optional<Integer> selectRatingByProfessionalAndExpertise(Long professional_id, Long expertise_id) {
//        return this.professionalExpertiseRepository.selectRatingByProfessionalAndExpertise(professional_id, expertise_id);
//    }
//
//    public Optional<ProfessionalExpertise> findByProfessionalAndExpertise(User user, Expertise expertise) {
//        return this.professionalExpertiseRepository.findByProfessionalAndExpertise(user, expertise);
//    }
//
//    public List<ProfessionalExpertise> findByExpertise(Expertise expertise) {
//        return this.professionalExpertiseRepository.findByExpertise(expertise);
//    }
//
//    public List<ProfessionalExpertise> findByProfessional(User user) {
//        return this.professionalExpertiseRepository.findByProfessional(user);
//    }

    public UserAddress save(UserAddress userAddress) {
        return this.userAddressRepository.save(userAddress);
    }

//    public void delete(ProfessionalExpertisePK professional_id){
//        professionalExpertiseRepository.deleteById(professional_id);
//    }
}
