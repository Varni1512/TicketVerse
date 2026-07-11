package com.ticketverse.service.impl;

import com.ticketverse.dto.request.RegisterDto;
import com.ticketverse.entity.Role;
import com.ticketverse.entity.User;
import com.ticketverse.exception.ApiException;
import com.ticketverse.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterDto registerDto;

    @BeforeEach
    void setUp() {
        registerDto = new RegisterDto("John", "Doe", "john@example.com", "password");
    }

    @Test
    void testRegisterUser_Success() {
        when(userRepository.existsByEmail(registerDto.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerDto.getPassword())).thenReturn("encodedPassword");
        
        String result = authService.register(registerDto);

        assertEquals("User registered successfully!", result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        when(userRepository.existsByEmail(registerDto.getEmail())).thenReturn(true);

        assertThrows(ApiException.class, () -> authService.register(registerDto));
        verify(userRepository, never()).save(any(User.class));
    }
}
