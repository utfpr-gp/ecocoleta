package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserAddress;
import com.ecocoleta.backend.domain.user.UserAddressPK;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.repositories.UserAddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserAddressService {

    @Autowired
    private UserAddressRepository userAddressRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private AddressService addressService;

    //    public Optional<Integer> selectRatingByProfessionalAndExpertise(Long professional_id, Long expertise_id) {
//        return this.professionalExpertiseRepository.selectRatingByProfessionalAndExpertise(professional_id, expertise_id);
//    }
//
//    public List<ProfessionalExpertise> findByExpertise(Expertise expertise) {
//        return this.professionalExpertiseRepository.findByExpertise(expertise);
//    }
//
//    public List<ProfessionalExpertise> findByProfessional(User user) {
//        return this.professionalExpertiseRepository.findByProfessional(user);
//    }
    public Optional<UserAddress> findByUserAndAddress(User user, Address address) {
        return this.userAddressRepository.findByUserAndAddress(user, address);
    }

    public List<UserAddress> findByUser(User user) {
        return this.userAddressRepository.findByUser(user);
    }

    public UserAddress save(UserAddress userAddress) {
        return this.userAddressRepository.save(userAddress);
    }

    public void deleteAddress(UserAddressPK userAddressPK) {
        userAddressRepository.deleteById(userAddressPK);
    }

    //metodo para edição de endereço
    public boolean editAddress(Long userId, AddressDTO addressDTO) {
        System.out.println("ENTROU NO EDIT ADDRESS SERVICE");

//         Busca o usuário por ID
        Optional<User> optionalUser = userService.getUserById(userId);
        Optional<Address> optionalAddress = addressService.getAddressById(addressDTO.id());

        if (optionalUser.isPresent() && optionalAddress.isPresent()) {
            UserAddressPK userAddressPK = new UserAddressPK(optionalUser.get().getId(), optionalAddress.get().getId());
            UserAddress userAddress = userAddressRepository.getReferenceById(userAddressPK);

//            Address address = new Address(addressDTO.city(), addressDTO.street(), addressDTO.number(), addressDTO.neighborhood(), addressDTO.cep());
            //TODO mapper adress|DTO para address
//            userAddress.setAddress(addressDTO.city(), addressDTO.street(), addressDTO.number(), addressDTO.neighborhood(), addressDTO.cep()));

            // Obter o Address existente do UserAddress
            Address existingAddress = userAddress.getAddress();

            // Atualizar os dados do Address existente com os dados do AddressDTO
            existingAddress.setCity(addressDTO.city());
            existingAddress.setStreet(addressDTO.street());
            existingAddress.setNumber(addressDTO.number());
            existingAddress.setNeighborhood(addressDTO.neighborhood());
            existingAddress.setCep(addressDTO.cep());

//            // Salvar o UserAddress (não é necessário, a menos que haja algo específico a ser feito)
            save(userAddress);
            System.out.println("Endereço editado com sucesso!!!!");
            return true;
        } else {
            System.err.println("Endereço não encontrado!!!!");
            return false;
        }
    }

    public boolean createAddress(UserAddress userAddress) {
        System.out.println("ENTROU NO CREATE ADDRESS SERVICE");

        //identifica o tipo de usuário
        User user = userAddress.getUser();
        UserRole userType = userService.getUserRole(userAddress.getUser());

        if (userType.equals(UserRole.RESIDENT)) {
            System.out.println("User instancia de RESIDENT, criando endereço.");
            save(userAddress);
            return true;
        } else {
            System.out.println("User instancia de WASTE_COLLECTOR, COMPANY, criando endereço.");
            if (userAddressRepository.findByUser(user).isEmpty()) {
                save(userAddress);
                return true;
            }
            System.err.println("User já possui endereço cadastrado.");
            return false;
        }
    }
}
