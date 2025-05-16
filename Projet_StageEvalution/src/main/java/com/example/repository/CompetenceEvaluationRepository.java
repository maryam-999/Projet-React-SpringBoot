package com.example.repository;

import com.example.model.CompetenceEvaluation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CompetenceEvaluationRepository extends JpaRepository<CompetenceEvaluation, Long> {
    List<CompetenceEvaluation> findByEvaluationId(Long evaluationId);

	void deleteByEvaluationId(Long evaluationId);

}
