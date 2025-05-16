package com.example.service;

import com.example.dto.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO login(String email, String password);
    AuthResponseDTO refreshAccessToken(String refreshToken);
  
}
