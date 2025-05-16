package com.example.service;

import java.util.List;
import java.util.Optional;

import com.example.model.Stage;

public interface StageService {

	 List<Stage> findByStagiaireId(Long stagiaireId);
	 List<Stage> findByTuteurId(Long tuteurId);
	 Optional<Stage> findById(Long id);
}
