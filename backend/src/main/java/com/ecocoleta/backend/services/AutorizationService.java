package com.ecocoleta.backend.services;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AutorizationService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username);
    }

    //Verifica se o user authenticado é igual o usuario que esta sendo passado como parametro ou se é admin
    public boolean isAuthorized(Long userId, UserDetails userDetails) {
        User userRequestParams = userRepository.findById(userId).get();

        if(userRequestParams.getEmail().equals(userDetails.getUsername()) || userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))){
            System.out.println("Usuario tem permissão");
            return true;
        }else {
            System.err.println("Usuario não tem permissão: " + userDetails.getUsername());
            return false;
        }
    }
}
