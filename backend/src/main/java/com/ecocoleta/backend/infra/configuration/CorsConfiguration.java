package com.ecocoleta.backend.infra.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(frontendUrl)
//                .allowedOrigins(frontendUrl, "https://10.0.2.2:4200", "https://localhost:4200", "http://10.0.2.2:4200") /*TESTE LOCAL COM URLS LOCALHOST*/
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "PATCH", "CONNECT");
//                .allowCredentials(true); //VERIFICAR SE É NECESSÁRIO
    }
}
