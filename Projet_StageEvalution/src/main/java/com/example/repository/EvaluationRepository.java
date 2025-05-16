package com.example.repository;

import com.example.model.Evaluation;
import com.example.model.Stage;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Evaluation findByStageId(Long stageId);
    List<Evaluation> findByStageIdIn(List<Long> stageIds);

}
