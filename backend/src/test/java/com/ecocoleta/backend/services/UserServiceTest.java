package com.ecocoleta.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

import com.ecocoleta.backend.domain.user.User;
import com.ecocoleta.backend.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        passwordEncoder = new BCryptPasswordEncoder(); // Usa a instância real do encoder
    }

    @Test
    public void testCreateUser_ShouldEncryptPasswordAndSaveUser() {
        // Dados de entrada
        User user = new User("John Doe", "john@example.com", "password123", "99999999", null);

        // Simulação de salvamento
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(1L);  // Simula a atribuição de um ID
            return savedUser;
        });

        // Chamada ao método de criação
        User createdUser = userService.createUser(user);

        // Valida se a senha foi criptografada usando o BCrypt (em vez de comparar diretamente)
        assertTrue(passwordEncoder.matches("password123", createdUser.getPassword()));

        // Verifica se o nome e o email foram persistidos corretamente
        assertEquals("John Doe", createdUser.getName());
        assertEquals("john@example.com", createdUser.getEmail());

        // Verifica se o repositório foi chamado corretamente
        verify(userRepository, times(1)).save(user);
    }
}