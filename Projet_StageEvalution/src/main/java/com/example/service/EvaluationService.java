package com.example.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.model.Evaluation;

@Service
public interface EvaluationService {
	 Evaluation findByStageId(Long stageId);
	 Optional<Evaluation> findById(Long id);
	 Evaluation save(Evaluation evaluation);
	 void delete(Evaluation evaluation);
	 boolean existsById(Long evaluationId);
	 void deleteById(Long evaluationId);
} 