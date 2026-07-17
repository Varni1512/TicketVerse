package com.ticketverse.controller;

import com.ticketverse.dto.response.UserDto;
import com.ticketverse.entity.Role;
import com.ticketverse.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/role")
    public ResponseEntity<UserDto> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Role role = Role.valueOf(payload.get("role").toUpperCase());
        return ResponseEntity.ok(userService.updateUserRole(id, role));
    }
}
