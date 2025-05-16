package com.example.controller;

import com.example.dto.AuthResponseDTO;
import com.example.dto.LoginDTO;
import com.example.dto.RefreshTokenRequest;
import com.example.dto.UserDTO;
import com.example.model.User;
import com.example.repository.AuthRepository;
import com.example.security.jwt.JwtUtil;
import com.example.service.AdminService;
import com.example.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
  
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDto) {
        AuthResponseDTO authResponse = authService.login(loginDto.getEmail(), loginDto.getPassword());
        return ResponseEntity.ok(authResponse);
    }
    
    @PostMapping("/token/refresh")
    public ResponseEntity<AuthResponseDTO> refreshAccessToken(@RequestBody RefreshTokenRequest request) {
        AuthResponseDTO newTokens = authService.refreshAccessToken(request.getRefreshToken());
        return ResponseEntity.ok(newTokens);
    }
    
    
   
}
