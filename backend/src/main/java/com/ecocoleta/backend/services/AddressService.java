package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.address.AddressDTO;
import com.ecocoleta.backend.domain.company.Company;
import com.ecocoleta.backend.domain.resident.Resident;
import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.domain.user.UserRole;
import com.ecocoleta.backend.domain.wasteCollector.WasteCollector;
import com.ecocoleta.backend.repositories.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserService userService;

/*
    public List<Address> getUserAddresses(User user) {
        List<Address> listAddress = new ArrayList<>();

        switch (getUserType(user)) {
            case RESIDENT:
                System.err.println("User instancia de RESIDENT");
                Resident resident = (Resident) user;
//                listAddress = addressRepository.findAllById(Collections.singleton(resident.getResidentAddresses()));
//TODO retorno do tipo resident
                break;
            case WASTE_COLLECTOR:
                System.err.println("User instancia de WASTE_COLLECTOR");
                WasteCollector wasteCollector = (WasteCollector) user;
                listAddress = addressRepository.findAllById(Collections.singleton(wasteCollector.getAddress().getId()));
            break;
            case COMPANY:
                System.err.println("User instancia de COMPANY");
                Company company = (Company) user;
                listAddress = addressRepository.findAllById(Collections.singleton(company.getAddress().getId()));
                break;
            case ADMIN:
                System.err.println("User instancia de ADMIN");
                //???....
                break;
            default:
                throw new UnsupportedOperationException("errocustom switch case do get address.");
        }

        //não retornou nada ...
        return  listAddress;
    }
*/

    public void editAddress(User user, AddressDTO addressDTO) {

    }

    //TODO terminar de fazer metodo de criação de enderço como resident
/*
    public boolean createAddress(User user, AddressDTO addressDTO) {
        Address address = new Address(addressDTO.city(), addressDTO.street(), addressDTO.number(), addressDTO.neighborhood(), addressDTO.cep());

        switch (getUserType(user)) {
            case RESIDENT:
                System.out.println("User instancia de RESIDENT");
                Resident resident = (Resident) user;
                System.out.println("OBJ ADDRESS: " + address.toString());

                //teste
                if (resident.getResidentAddresses().isEmpty()){
                    System.out.println("lista residentAddress de 1xn esta vazia");

                    System.out.println("salvar... obj address");
                    addressRepository.save(address);
                    System.out.println("salvo obj address/// set address e salvar user resident");

                    // Cria um novo objeto ResidentAddress
                    UserAddress userAddress = new UserAddress(resident, address);

                    // Adiciona o ResidentAddress à lista de Resident
                    resident.getResidentAddresses().add(userAddress);

                    // Salva o endereço no repositório
                    addressRepository.save(address);

                    // Salva as atualizações no usuário Resident
                    userService.saveUser(resident);

//                    Set<ResidentAddress> residentAddressHashSet = new HashSet<>();
//                    residentAddressHashSet.add(new ResidentAddress(resident, address));
//
//
//                    System.out.println("CRIOU RESIDENTADDRESS");
//                    resident.setResidentAddresses(residentAddressHashSet);
//
//                    residentAddressService.save((ResidentAddress) resident.getResidentAddresses());

//                    userService.saveUser(resident);

                    return true;
                }else if (!resident.getResidentAddresses().isEmpty()){
                    System.out.println("lista residentAddress de 1xn NÃO vazia");

                    Set<UserAddress> userAddressHashSet = resident.getResidentAddresses();
                    System.out.println("HASHSET DE RESIDENTADDRESS CADASTRADOS..." + userAddressHashSet.toString());
                    userAddressHashSet.add(new UserAddress(resident, address));


                    System.out.println("TO STRING RESIDENTADDRESS..." + resident.getResidentAddresses().toString());
                    System.out.println("OBJ ADDRESS: " + address.toString());

                    System.out.println("CRIOU RESIDENTADDRESS");
                    resident.setResidentAddresses(userAddressHashSet);
                    userService.saveUser(resident);

                    return true;
                }
                break;
            case WASTE_COLLECTOR:
                System.out.println("User instancia de WASTCOLLECTOR");
                WasteCollector wasteCollector = (WasteCollector) user;

                System.out.println("OBJ ADDRESS: " + address.toString());

                if (wasteCollector.getAddress() == null) {
                    System.out.println("address de wastecolector vazio");

                    System.out.println("salvar... obj address");
//                    addressRepository.save(address);
//                    System.out.println("salvo obj address/// set address e salvar user wastcolector");

                    wasteCollector.setAddress(address);
//                    userService.saveUser(wasteCollector);
                    return true;
                }
                if (wasteCollector.getAddress() != null) {
                    System.out.println("ja tem address cadastrado");
                    return false;
                }
                break;
            case COMPANY:
                System.out.println("User instancia de COMPANY   ");
                Company company = (Company) user;
                System.out.println("OBJ ADDRESS: " + address.toString());

                if (company.getAddress() == null) {
                    System.out.println("address de company vazio");

                    System.out.println("salvar e criar... obj address");
                    addressRepository.save(address);
                    company.setAddress(address);
                    userService.saveUser(company);
                    return true;
                }
                if (company.getAddress() != null) {
                    System.out.println("ja tem address cadastrado");
                    return false;
                }
                break;
            case ADMIN:
                break;
            // Adicione outros casos conforme necessário
            default:
                throw new UnsupportedOperationException("A edição de endereço não é suportada para este tipo de usuário.");
        }

        return false;
    }
*/

    //TODO fazer metodo de deletar endereço


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