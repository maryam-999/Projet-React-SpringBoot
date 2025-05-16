package com.example.service.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.CompetenceSpecifiqueEvaluation;
import com.example.repository.CompetenceSpecifiqueEvaluationRepository;
import com.example.service.CompetenceSpecifiqueEvaluationService;

@Service
public class CompetenceSpecifiqueEvaluationServiceImpl implements CompetenceSpecifiqueEvaluationService {
   
	@Autowired
    private CompetenceSpecifiqueEvaluationRepository competenceSpecifiqueEvaluationRepository;


    @Override
    public List<CompetenceSpecifiqueEvaluation> findByEvaluationId(Long evaluationId) {
        return competenceSpecifiqueEvaluationRepository.findByEvaluationId(evaluationId);
    }
}
 