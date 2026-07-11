package com.ticketverse.service;

import com.ticketverse.dto.request.LoginDto;
import com.ticketverse.dto.request.RegisterDto;
import com.ticketverse.dto.response.JwtAuthResponse;

public interface AuthService {
    String register(RegisterDto registerDto);
    JwtAuthResponse login(LoginDto loginDto);
}
