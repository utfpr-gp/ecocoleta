package com.ecocoleta.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	@Value("${twilio.account.sid}")
	private static String secret;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		System.err.println(secret);
	}

}
