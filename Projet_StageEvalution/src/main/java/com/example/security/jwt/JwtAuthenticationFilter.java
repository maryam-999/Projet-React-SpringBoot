package com.example.security.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");     // authheader va contenir un token recupéré qui est stocké dans Authorization
        if (authHeader != null && authHeader.startsWith("Bearer ")) {   // la valeur de Authorization est Bearer token_genéré
            String token = authHeader.substring(7);       // à partir de Authorization
            String email = jwtUtil.extractEmail(token);   // à partir de token 
            String role = jwtUtil.extractRole(token);     // à partir de token aussi 

            if (email != null && role != null && SecurityContextHolder.getContext().getAuthentication() == null) {     // Apres le register, il verifie si y a un email, role et qu'il n'est pas enocre authentifié
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);  // Ex: TUTEUR ou STAGIAIRE ou ADMIN      // creer l'objet avec une authorité = role defini dans le token
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(                    // recuperation de l'email et l'authorité
                        email, null, Collections.singleton(authority)                  
                );
                SecurityContextHolder.getContext().setAuthentication(auth);                      // set de l'authorité 
            }
        }
        filterChain.doFilter(request, response);                             // envoyé la reponse du request (url qlq envoyée)
    }
}
