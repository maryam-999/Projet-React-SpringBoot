package com.example.repository;
import com.example.enumerations.Role;
import com.example.model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

}
