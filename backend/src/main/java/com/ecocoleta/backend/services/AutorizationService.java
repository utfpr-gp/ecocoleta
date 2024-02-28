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

    //TODO refatorar metodo validador de permisão de usuario
    //servicço validação de ususario > boolean  params(userid, user athenticationPrincipal)
    //verifica if user role athentication is admin || ou user id é == athentication.userid
    //validao retune true
    //else retun false.
    //TODO não faz sentido verificar o userId é isgual o userId do mesmo objeto kkk
    //ideia verificar o userId de parametro se é = userId do user authenticado > ok || se não for = então user authenticado tem que ser admin
    public boolean validateUserPermission(Long userId, UserDetails user) {
        User userAutorized = userRepository.findById(userId).get();

        //TODO verificar apra user userId.equals...
        if (user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) || userId == userAutorized.getId()){
            System.err.println("Usuario tem permissão");
            return true;
        }else {
            System.err.println("Usuario não tem permissão");
            return false;
        }
    }
}
