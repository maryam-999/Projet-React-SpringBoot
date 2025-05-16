package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.model.CompetenceSpecifiqueEvaluation;

@Repository
public interface CompetenceSpecifiqueEvaluationRepository extends JpaRepository<CompetenceSpecifiqueEvaluation, Long> {
    List<CompetenceSpecifiqueEvaluation> findByEvaluationId(Long evaluationId);

	void deleteByEvaluationId(Long evaluationId);
}
