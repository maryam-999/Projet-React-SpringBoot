package com.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.enumerations.Role;
import com.example.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	List<User> findByRole(Role role);
    Optional<User> findByIdAndRole(Long id, Role role);
    List<User> findByRoleAndEntreprise(Role role, String entreprise);
    boolean existsByEmail(String email);
}
