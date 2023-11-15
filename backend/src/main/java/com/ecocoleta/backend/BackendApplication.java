package com.ecocoleta.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;


@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

	@Value("${spring.datasource.url}")
	private String secret;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

//		TODO remover sout teste
	@Override
	public void run(String... args) {
		// Agora você pode acessar e imprimir o valor de twilioAccountSid
		System.err.println("Chave é... " + secret);
	}

}
