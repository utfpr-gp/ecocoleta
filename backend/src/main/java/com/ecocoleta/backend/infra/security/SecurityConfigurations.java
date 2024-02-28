package com.ecocoleta.backend.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {
                    //USER
                    req.requestMatchers(HttpMethod.POST, "/user/**").permitAll(); // teste
                    req.requestMatchers(HttpMethod.GET, "/user/**").authenticated(); // teste
                    req.requestMatchers(HttpMethod.PUT, "/user/**").authenticated(); // teste
                    req.requestMatchers(HttpMethod.DELETE, "/user/**").hasRole("ADMIN"); // teste
                    //MY-ACCOUNT
                    req.requestMatchers(HttpMethod.POST, "/myaccount/**").authenticated(); // teste
                    req.requestMatchers(HttpMethod.GET, "/myaccount/**").authenticated(); // teste
                    req.requestMatchers(HttpMethod.PUT, "/myaccount/**").authenticated(); // teste
                    req.requestMatchers(HttpMethod.DELETE, "/myaccount/**").authenticated(); // teste

                    //LOGIN
                    req.requestMatchers(HttpMethod.POST, "/auth/login").permitAll();
                    //OTHER ROUTES
                    req.requestMatchers(HttpMethod.GET, "/hello").hasRole("ADMIN"); //apenas usuarios admin -- teste
//                    req.anyRequest().authenticated(); //apenas usuarios autenticados de qualquer role
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class) // adicionar o nosso filtro antes do filtro do spring boot, o nosso filtro ta fazendo a verificação do token...
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
