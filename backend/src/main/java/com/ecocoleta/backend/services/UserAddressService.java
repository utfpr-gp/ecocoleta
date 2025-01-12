package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.address.Address;
import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.userAddress.UserAddress;
import com.ecocoleta.backend.domain.userAddress.UserAddressPK;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.infra.exception.ValidException;
import com.ecocoleta.backend.repositories.UserAddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserAddressService {

    @Autowired
    private UserAddressRepository userAddressRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private AddressService addressService;

    public List<AddressDTO> getAddressList(Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new ValidException("Usuário não encontrado para o ID: " + userId));

        return userAddressRepository.findByUser(user).stream()
                .map(userAddress -> convertToDTO(userAddress.getAddress()))
                .collect(Collectors.toList());
    }

    public AddressDTO getSpecificAddress(Long userId, Long addressId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new ValidException("Usuário não encontrado para o ID: " + userId));

        Address address = addressService.getAddressById(addressId)
                .orElseThrow(() -> new ValidException("Endereço não encontrado para o ID: " + addressId));

        userAddressRepository.findByUserAndAddress(user, address)
                .orElseThrow(() -> new ValidException("Relacionamento entre usuário e endereço não encontrado."));

        return convertToDTO(address);
    }

    public void createAddress(Long userId, AddressDTO addressDTO) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new ValidException("Usuário não encontrado para o ID: " + userId));

        Address address = convertFromDTO(addressDTO);
        UserAddress userAddress = new UserAddress(user, address);

        if (isAddressCreationAllowed(user, userAddress)) {
            userAddressRepository.save(userAddress);
        } else {
            throw new ValidException("Erro ao criar endereço. Usuário já possui endereço cadastrado.");
        }
    }

    public void updateAddress(Long userId, AddressDTO addressDTO) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new ValidException("Usuário não encontrado para o ID: " + userId));

        Address address = addressService.getAddressById(addressDTO.id())
                .orElseThrow(() -> new ValidException("Endereço não encontrado para o ID: " + addressDTO.id()));

        UserAddress userAddress = userAddressRepository.findByUserAndAddress(user, address)
                .orElseThrow(() -> new ValidException("Relacionamento entre usuário e endereço não encontrado."));

        updateAddressFromDTO(userAddress.getAddress(), addressDTO);
        userAddressRepository.save(userAddress);
    }

    public void deleteAddress(Long userId, Long addressId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new ValidException("Usuário não encontrado para o ID: " + userId));

        Address address = addressService.getAddressById(addressId)
                .orElseThrow(() -> new ValidException("Endereço não encontrado para o ID: " + addressId));

        UserAddress userAddress = userAddressRepository.findByUserAndAddress(user, address)
                .orElseThrow(() -> new ValidException("Relacionamento entre usuário e endereço não encontrado."));

        userAddressRepository.delete(userAddress);
    }

    private boolean isAddressCreationAllowed(User user, UserAddress userAddress) {
        UserRole userType = userService.getUserRole(user);

        if (userType.equals(UserRole.RESIDENT)) {
            return true; // Residentes podem ter vários endereços
        } else {
            return userAddressRepository.findByUser(user).isEmpty();
        }
    }

    private void updateAddressFromDTO(Address address, AddressDTO addressDTO) {
        address.setName(addressDTO.name());
        address.setCity(addressDTO.city());
        address.setStreet(addressDTO.street());
        address.setNumber(addressDTO.number());
        address.setNeighborhood(addressDTO.neighborhood());
        address.setCep(addressDTO.cep());
        address.setLatitude(addressDTO.latitude());
        address.setLongitude(addressDTO.longitude());
    }

    private Address convertFromDTO(AddressDTO dto) {
        return new Address(
                dto.name(),
                dto.city(),
                dto.street(),
                dto.number(),
                dto.neighborhood(),
                dto.cep(),
                dto.state(),
                dto.latitude(),
                dto.longitude()
        );
    }

    private AddressDTO convertToDTO(Address address) {
        return new AddressDTO(
                address.getId(),
                address.getName(),
                address.getCity(),
                address.getStreet(),
                address.getNumber(),
                address.getNeighborhood(),
                address.getCep(),
                address.getState(),
                address.getLatitude(),
                address.getLongitude()
        );
    }
}
