package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.company.Company;
import com.ecocoleta.backend.domain.company.dto.CompanyGetDTO;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.resident.dto.ResidentGetDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.domain.user.dto.UserGetDTO;
import com.ecocoleta.backend.domain.user.dto.UserTypeCountDTO;
import com.ecocoleta.backend.domain.user.dto.UserUpdateDTO;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.domain.wasteCollector.dto.WasteCollectorGetDTO;
import com.ecocoleta.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Serviço para gerenciar operações relacionadas a usuários.
 */
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

    /** 🔄 Obtém usuários filtrados por tipo */
    public Page<UserGetDTO> getUsersByRole(UserRole role, Pageable pageable) {
        Page<User> users;

        if (role != null) {
            users = userRepository.findAllByRole(role, pageable);
        } else {
            users = userRepository.findAll(pageable); // Retorna todos se o tipo não for especificado
        }

        return users.map(UserGetDTO::new);
    }

    /** ✅ Alterna o status de um usuário (ativa ou desativa) */
    @Transactional
    public void toggleUserStatus(Long id, boolean status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        user.setActivo(status);
        userRepository.save(user);
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

    /**
     * Obtém a contagem de usuários agrupados por tipo (Resident, WasteCollector, Company).
     *
     * @return Lista de UserTypeCountDTO contendo a contagem de usuários por tipo.
     */
    public List<UserTypeCountDTO> getUserTypeCounts() {
        return userRepository.countUsersByRole();
    }

    @Transactional
    public Object updateUser(Long id, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        // Atualiza dados comuns a todos os usuários
        user.update(userUpdateDTO);

        // Tratamento específico baseado no tipo do usuário
        if (user instanceof WasteCollector wasteCollector) {
            updateWasteCollector(wasteCollector, userUpdateDTO);
        } else if (user instanceof Company company) {
            updateCompany(company, userUpdateDTO);
        } else if (user instanceof Resident resident) {
            updateResident(resident, userUpdateDTO);
        }

        // Retorna o DTO atualizado de acordo com o tipo de usuário
        return getUserDtoById(user.getId());
    }

    private void updateWasteCollector(WasteCollector wasteCollector, UserUpdateDTO userUpdateDTO) {
        if (userUpdateDTO.cpf() != null) {
            wasteCollector.setCpf(userUpdateDTO.cpf());
        }
        if (userUpdateDTO.picture() != null) {
            wasteCollector.setPicture(userUpdateDTO.picture());
        }
        if (userUpdateDTO.longitude() != null && userUpdateDTO.latitude() != null) {
            wasteCollector.updateLocation(userUpdateDTO.longitude(), userUpdateDTO.latitude());
        }
    }

    private void updateCompany(Company company, UserUpdateDTO userUpdateDTO) {
        if (userUpdateDTO.cnpj() != null) {
            company.setCnpj(userUpdateDTO.cnpj());
        }
        if (userUpdateDTO.companyName() != null) {
            company.setCompany_name(userUpdateDTO.companyName());
        }
    }

    private void updateResident(Resident resident, UserUpdateDTO userUpdateDTO) {
        // Se houver atributos específicos para o residente, atualize-os aqui
    }

}
