package com.example.service;

import java.util.List;

import com.example.dto.CompetenceDTO;
import com.example.dto.EvaluationDTO;
import com.example.dto.StageEvaluationResponseDTO;
import com.example.dto.UserDTO;
import com.example.enumerations.CategorieCompetence;
import com.example.enumerations.Role;

public interface StagiaireTuteurService {
    
	UserDTO getProfile(String token);
    List<StageEvaluationResponseDTO> getStagesWithEvaluationsByUserIdAndRole(Long userId, Role role);
    EvaluationDTO createEvaluation(EvaluationDTO evaluationDTO);
    List<CompetenceDTO> getCompetencesByCategorie(CategorieCompetence categorie);
    void deleteEvaluation(Long evaluationId);
	EvaluationDTO updateEvaluation(Long evaluationId, EvaluationDTO evaluationDTO);
}
