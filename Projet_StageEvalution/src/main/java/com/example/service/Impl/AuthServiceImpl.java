package com.example.service.Impl;

import com.example.dto.AuthResponseDTO;
import com.example.dto.UserDTO;
import com.example.model.User;
import com.example.repository.AuthRepository;
import com.example.security.jwt.JwtUtil;
import com.example.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthRepository authRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    
    
    @Override
    public AuthResponseDTO login(String email, String password) {
        User user = authRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return new AuthResponseDTO(accessToken, refreshToken);
    }
    
    @Override
    public AuthResponseDTO refreshAccessToken(String refreshToken) {
        if (jwtUtil.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token expired");
        }

        String email = jwtUtil.extractEmail(refreshToken);
        User user = authRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtUtil.generateToken(user);

        return new AuthResponseDTO(newAccessToken, refreshToken);
    }

   
    
    
    
    
    
}
