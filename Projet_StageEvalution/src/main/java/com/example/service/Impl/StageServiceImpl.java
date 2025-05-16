package com.example.service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Stage;
import com.example.repository.StageRepository;
import com.example.service.StageService;

@Service
public class StageServiceImpl implements StageService {

	@Autowired
    private StageRepository stageRepository;


    @Override
    public List<Stage> findByStagiaireId(Long stagiaireId) {
        return stageRepository.findByStagiaireId(stagiaireId);
    }

    @Override
    public List<Stage> findByTuteurId(Long tuteurId) {
        return stageRepository.findByTuteurId(tuteurId);
    }

    @Override
    public Optional<Stage> findById(Long id) {
        return stageRepository.findById(id);
    }
}
