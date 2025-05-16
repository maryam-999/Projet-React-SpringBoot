package com.example.service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Competence;
import com.example.model.CompetenceEvaluation;
import com.example.repository.CompetenceEvaluationRepository;
import com.example.repository.CompetenceRepository;
import com.example.service.CompetenceService;

@Service
public class CompetenceServiceImpl implements CompetenceService {

    @Autowired
    private CompetenceEvaluationRepository competenceEvaluationRepository;
	@Autowired
	private CompetenceRepository competenceRepository;
	
	
    @Override
    public List<CompetenceEvaluation> findByEvaluationId(Long evaluationId) {
        return competenceEvaluationRepository.findByEvaluationId(evaluationId);
    }
    
    
	 @Override
	 public Competence findById(Long competenceId) {
	        Optional<Competence> competence = competenceRepository.findById(competenceId);
	        return competence.orElse(null);  
	 }
   
}
