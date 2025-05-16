package com.example.repository;

import com.example.model.Stage;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StageRepository extends JpaRepository<Stage, Long> {

	List<Stage> findByStagiaireId(Long stagiaireId);

	List<Stage> findByTuteurId(Long tuteurId);
	
}
