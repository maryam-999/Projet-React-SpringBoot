package com.example.security.jwt;

import com.example.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component  
public class JwtUtil {

	private static final String SECRET_KEY = "maryem-une-cle-secrete-tres-forte-1234567890";
	private static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    private static final long EXPIRATION_TIME = 86400000; // 1 jour

    public static String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("nom", user.getNom());
        claims.put("prenom", user.getPrenom());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().name());
        claims.put("entreprise", user.getEntreprise());
        claims.put("institution", user.getInstitution());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail()) // subject = email (unique)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }
    
    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().name());

        long refreshTokenExpiration = 7 * 24 * 60 * 60 * 1000; // 7 jours

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(key)
                .compact();
    }
    
    // Extraire l'email à partir du token JWT
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    // Extraire le rôle à partir du token JWT 
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }
    
    public static Map<String, Object> parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
 // Extraire les informations du token
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Valider le token
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
}
