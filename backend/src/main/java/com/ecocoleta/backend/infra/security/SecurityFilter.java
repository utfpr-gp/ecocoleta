package com.ecocoleta.backend.infra.security;

import com.ecocoleta.backend.repositories.UserRepository;
import com.ecocoleta.backend.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String uri = request.getRequestURI();
        System.out.println("URI: " + uri);  // Log para depuração

        // Ignora rotas públicas (como /auth/login, /user (POST) para cadastro)
        if (uri.startsWith("/auth/login") || (uri.startsWith("/user") && request.getMethod().equals(HttpMethod.POST.name()))) {
            filterChain.doFilter(request, response);
            return; // Não valida o token para essas rotas
        }

        // Validação do token para rotas protegidas
        var token = this.recoverToken(request);
        if (token != null) {
            try {
                var loginEmail = tokenService.validateToken(token);
                UserDetails user = userRepository.findByEmail(loginEmail);

                var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (RuntimeException e) {
                // Token inválido ou expirado, você pode adicionar um tratamento aqui se necessário
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            return authHeader.replace("Bearer ", "");
        }
        return null;
    }

}
