package com.ticketverse.service;

import com.ticketverse.dto.response.UserDto;
import com.ticketverse.entity.Role;
import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto updateUserRole(Long userId, Role role);
}
