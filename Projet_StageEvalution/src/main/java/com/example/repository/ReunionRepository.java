package com.example.repository;

import com.example.model.Reunion;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReunionRepository extends JpaRepository<Reunion, Long> {
	
	 List<Reunion> findByUserId(Long userId);
	 Optional<Reunion> findByIdAndUserId(Long reunionId, Long userId);
	 List<Reunion> findByUserIdAndStartAfter(Long userId, LocalDateTime now);
	 long countByUserId(Long userId);

}
