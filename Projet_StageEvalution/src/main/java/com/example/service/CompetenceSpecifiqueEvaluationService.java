package com.example.service;

import java.util.List;

import com.example.model.CompetenceSpecifiqueEvaluation;

public interface CompetenceSpecifiqueEvaluationService {
    List<CompetenceSpecifiqueEvaluation> findByEvaluationId(Long evaluationId);

}
