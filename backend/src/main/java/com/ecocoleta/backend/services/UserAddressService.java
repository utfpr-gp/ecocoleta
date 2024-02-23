package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.company.Company;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserAddress;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.repositories.UserAddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public List<UserAddress> findByUser(User user) {
        return this.userAddressRepository.findByUser(user);
    }

    public UserAddress save(UserAddress userAddress) {
        return this.userAddressRepository.save(userAddress);
    }

//    public void delete(ProfessionalExpertisePK professional_id){
//        professionalExpertiseRepository.deleteById(professional_id);
//    }

    public boolean createAddress(UserAddress userAddress) {
        System.out.println("ENTROU NO CREATE ADDRESS SERVICE");

        //identifica o tipo de usuário
        User user = userAddress.getUser();
        UserRole userType = getUserType(userAddress.getUser());

        if (userType.equals(UserRole.RESIDENT)) {
            System.out.println("User instancia de RESIDENT, criando endereço.");
            save(userAddress);
            return true;
        }else {
            System.out.println("User instancia de WASTE_COLLECTOR, COMPANY, criando endereço.");
            if (userAddressRepository.findByUser(user).isEmpty()) {
                save(userAddress);
                return true;
            }
            System.err.println("User já possui endereço cadastrado.");
            return false;
        }
    }


    private UserRole getUserType(User user) {

        if (user instanceof WasteCollector) {
            return UserRole.WASTE_COLLECTOR;
        } else if (user instanceof Company) {
            return UserRole.COMPANY;
        } else if (user instanceof Resident) {
            return UserRole.RESIDENT;
        } /*else {
            // Adicione outros tipos conforme necessário
//            return UserRole.;
        }*/
        return null;
    }
}
