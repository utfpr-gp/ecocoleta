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
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                                //LOGIN
                                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()

                                //USER
                                .requestMatchers(HttpMethod.POST, "/user/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/user/**").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/user/**").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/user/**").hasRole("ADMIN")

                                //MY-ACCOUNT
                                .requestMatchers(HttpMethod.POST, "/myaccount/**").authenticated()
                                .requestMatchers(HttpMethod.GET, "/myaccount/**").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/myaccount/**").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/myaccount/**").authenticated()

                                //MATERIAL
                                .requestMatchers(HttpMethod.POST, "/material/**").authenticated()
                                .requestMatchers(HttpMethod.GET, "/material/**").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/material/**").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/material/**").authenticated()

                                //OTHER ROUTES
                                .requestMatchers(HttpMethod.GET, "/hello").permitAll() //todos user -- teste
//                                .requestMatchers(HttpMethod.GET, "/hello").hasRole("ADMIN") //apenas usuarios admin -- teste
//                    req.anyRequest().authenticated(); //apenas usuarios autenticados de qualquer role
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class); // adicionar o nosso filtro antes do filtro do spring boot, o nosso filtro ta fazendo a verificação do token...
        return http.build();
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
