package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.company.Company;
import com.ecocoleta.backend.domain.company.dto.CompanyGetDTO;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.resident.dto.ResidentGetDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.domain.user.dto.UserGetDTO;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.domain.wasteCollector.dto.WasteCollectorGetDTO;
import com.ecocoleta.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

        public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Object getUserDtoById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (user instanceof Resident resident) {
            return new ResidentGetDTO(
                    resident.getId(),
                    resident.getName(),
                    resident.getEmail(),
                    resident.getPhone(),
                    resident.getRole(),
                    resident.getCreateTime(),
                    resident.getUpdateTime()
            );
        } else if (user instanceof WasteCollector wasteCollector) {
            return new WasteCollectorGetDTO(
                    wasteCollector.getId(),
                    wasteCollector.getName(),
                    wasteCollector.getEmail(),
                    wasteCollector.getPhone(),
                    wasteCollector.getRole(),
                    wasteCollector.getCreateTime(),
                    wasteCollector.getUpdateTime(),
                    wasteCollector.getCpf(),
                    wasteCollector.getScore(),
                    wasteCollector.getPicture()
            );
        } else if (user instanceof Company company) {
            return new CompanyGetDTO(
                    company.getId(),
                    company.getName(),
                    company.getEmail(),
                    company.getPhone(),
                    company.getRole(),
                    company.getCreateTime(),
                    company.getUpdateTime(),
                    company.getCnpj(),
                    company.getCompany_name()
            );
        } else {
            return new UserGetDTO(user);
//            return new UserGetDTO(
//                    user.getId(),
//                    user.getName(),
//                    user.getEmail(),
//                    user.getPhone(),
//                    user.getRole(),
//                    user.getCreateTime(),
//                    user.getUpdateTime()
//            );
        }
    }

    public User getUserByUserEmail(String userEmail) {
        return userRepository.findUserByEmailIs(userEmail);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Page<User> getAllByActivoTrue(Pageable pageable) {
        return userRepository.findAllByActivoTrue(pageable);
    }

    public Long getUserIdByUserEmail(String userEmail) {
        User user = userRepository.findUserByEmailIs(userEmail);
        return user.getId();
    }

    public UserDetails findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {

        String encryptedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
        user.setPassword(encryptedPassword);

        return userRepository.save(user);
    }

    public UserRole getUserRole(User user) {

        if (user instanceof WasteCollector) {
            return UserRole.WASTE_COLLECTOR;
        } else if (user instanceof Company) {
            return UserRole.COMPANY;
        } else if (user instanceof Resident) {
            return UserRole.RESIDENT;
        } else {
            // Adicione outros tipos conforme necessário
            return null;
        }
//        return null;
    }

    public boolean existsByid(Long id) {
        return userRepository.existsById(id);
    }

    public Page<User> getAllByRole(UserRole role, Pageable pageable) {
        return userRepository.findAllByRole(role, pageable);
    }
}
