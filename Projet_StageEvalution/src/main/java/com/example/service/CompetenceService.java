package com.example.service;

import java.util.List;

import com.example.model.Competence;
import com.example.model.CompetenceEvaluation;

public interface CompetenceService {
	
    List<CompetenceEvaluation> findByEvaluationId(Long evaluationId);
	Competence findById(Long competenceId);

}
 