package com.ticketverse.service.impl;

import com.ticketverse.dto.request.LoginDto;
import com.ticketverse.dto.request.RegisterDto;
import com.ticketverse.dto.response.JwtAuthResponse;
import com.ticketverse.entity.Role;
import com.ticketverse.entity.User;
import com.ticketverse.exception.ApiException;
import com.ticketverse.repository.UserRepository;
import com.ticketverse.security.JwtTokenProvider;
import com.ticketverse.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final com.ticketverse.service.OtpService otpService;

    @Override
    public String register(RegisterDto registerDto) {

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email is already in use!");
        }

        User user = User.builder()
                .firstName(registerDto.getFirstName())
                .lastName(registerDto.getLastName())
                .email(registerDto.getEmail())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .role(Role.USER) // Default role
                .build();

        userRepository.save(user);

        return "User registered successfully!";
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        return new JwtAuthResponse(token, "Bearer", user.getRole().name());
    }
    
    @Override
    public void forgotPassword(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "User not found with this email");
        }
        
        otpService.generateAndSendOtp(email);
    }

    @Override
    public void resetPassword(com.ticketverse.dto.request.ResetPasswordRequest request) {
        if (!otpService.verifyOtp(request.getEmail(), request.getOtpCode())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid or expired OTP");
        }
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
                
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
