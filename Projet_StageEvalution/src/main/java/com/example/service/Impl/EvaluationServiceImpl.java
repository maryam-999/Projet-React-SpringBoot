package com.example.service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Evaluation;
import com.example.repository.EvaluationRepository;
import com.example.service.EvaluationService;

@Service
public class EvaluationServiceImpl implements EvaluationService {

	@Autowired
    private EvaluationRepository evaluationRepository;


    @Override
    public Evaluation findByStageId(Long stageId) {
        return evaluationRepository.findByStageId(stageId);
    }

    @Override
    public Optional<Evaluation> findById(Long id) {
        return evaluationRepository.findById(id);
    }

    @Override
    public Evaluation save(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    @Override
    public void delete(Evaluation evaluation) {
        evaluationRepository.delete(evaluation);
    }
    
    
    @Override
    public void deleteById(Long id) {
        evaluationRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return evaluationRepository.existsById(id);
    }
}
