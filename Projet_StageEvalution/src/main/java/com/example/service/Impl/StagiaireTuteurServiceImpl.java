package com.example.service.Impl;

import com.example.dto.*;
import com.example.enumerations.CategorieCompetence;
import com.example.enumerations.Role;
import com.example.model.*;
import com.example.repository.AuthRepository;
import com.example.repository.CompetenceEvaluationRepository;
import com.example.repository.CompetenceRepository;
import com.example.repository.CompetenceSpecifiqueEvaluationRepository;
import com.example.repository.EvaluationRepository;
import com.example.repository.StageRepository;
import com.example.repository.UserRepository;
import com.example.security.jwt.JwtUtil;
import com.example.service.StagiaireTuteurService;

import jakarta.transaction.Transactional;

import com.example.service.CompetenceService;
import com.example.service.CompetenceSpecifiqueEvaluationService;
import com.example.service.EvaluationService;
import com.example.service.StageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StagiaireTuteurServiceImpl implements StagiaireTuteurService {

  

    @Autowired
    private CompetenceService competenceService;

    @Autowired
    private StageService stageService;
    
    @Autowired
    private EvaluationService evaluationService;
    
    @Autowired
    private CompetenceEvaluationRepository competenceEvaluationRepository;
    
    @Autowired
    private StageRepository stageRepository;
    
    @Autowired
    private CompetenceSpecifiqueEvaluationRepository competenceSpecifiqueEvaluationRepository;

   

    @Autowired
    private CompetenceSpecifiqueEvaluationService competenceSpecifiqueEvaluationService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthRepository authRepository;
    
    @Autowired
    private CompetenceRepository competenceRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;
    
    @Override 
    public UserDTO getProfile(String token) {
        String jwtToken = token.substring(7); 
        String email = jwtUtil.extractEmail(jwtToken); 

        User user = authRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDTO(
            user.getId(),
            user.getNom(),
            user.getPrenom(),
            user.getEmail(),
            user.getPassword(),
            user.getEntreprise(),
            user.getInstitution(),
            user.getRole()
        );
    }
    
   
    @Override
    public List<CompetenceDTO> getCompetencesByCategorie(CategorieCompetence categorie) {
        return competenceRepository.findByCategorie(categorie)
            .stream()
            .map(comp -> new CompetenceDTO(comp.getId(), comp.getIntitule(), comp.getCategorie()))
            .collect(Collectors.toList());
    }
    
    
    @Override
    public List<StageEvaluationResponseDTO> getStagesWithEvaluationsByUserIdAndRole(Long userId, Role role) {
        List<Stage> stages;

        if (role == Role.STAGIAIRE) {
            stages = stageService.findByStagiaireId(userId);
        } else if (role == Role.TUTEUR) {
            stages = stageService.findByTuteurId(userId);
        } else {
            throw new RuntimeException("Rôle non supporté : " + role);
        }

        if (stages.isEmpty()) {
            throw new RuntimeException("Aucun stage trouvé pour l'utilisateur avec l'ID : " + userId);
        }

        return stages.stream().map(stage -> {
            StageDTO stageDTO = new StageDTO(
                    stage.getId(),
                    stage.getTheme(),
                    stage.getObjectif(),
                    stage.getEntreprise(),
                    stage.getDateDebut(),
                    stage.getDateFin(),
                    stage.getStagiaire().getId(),
                    stage.getTuteur().getId()
            );

            // Mapper stagiaire
            User stagiaireEntity = stage.getStagiaire();
            UserDTO stagiaireDTO = new UserDTO(
                    stagiaireEntity.getId(),
                    stagiaireEntity.getNom(),
                    stagiaireEntity.getPrenom(),
                    stagiaireEntity.getEmail(),
                    stagiaireEntity.getEntreprise(),
                    stagiaireEntity.getInstitution(),
                    stagiaireEntity.getRole()
            );

            // Mapper tuteur
            User tuteurEntity = stage.getTuteur();
            UserDTO tuteurDTO = new UserDTO(
                    tuteurEntity.getId(),
                    tuteurEntity.getNom(),
                    tuteurEntity.getPrenom(),
                    tuteurEntity.getEmail(),
                    tuteurEntity.getEntreprise(),
                    tuteurEntity.getInstitution(),
                    tuteurEntity.getRole()
            );

            Evaluation evaluation = evaluationService.findByStageId(stage.getId());
            EvaluationDTO evaluationDTO = null;
            List<CompetenceDTO> competenceDTOs = null;
            List<CompetenceEvaluationDTO> competenceEvaluationDTOs = null;
            List<CompetenceSpecifiqueEvaluationDTO> competenceSpecifiqueEvaluationDTOs = null;

            if (evaluation != null) {
                competenceEvaluationDTOs = competenceService.findByEvaluationId(evaluation.getId()).stream()
                        .map(ce -> new CompetenceEvaluationDTO(
                                ce.getId(),
                                ce.getCompetence().getId(),
                                ce.getEvaluation().getId(),
                                ce.getNiveau()
                        )).collect(Collectors.toList());

                competenceSpecifiqueEvaluationDTOs = competenceSpecifiqueEvaluationService.findByEvaluationId(evaluation.getId()).stream()
                        .map(cse -> new CompetenceSpecifiqueEvaluationDTO(
                                cse.getId(),
                                cse.getIntitule(),
                                cse.getNiveau(),
                                cse.getEvaluation().getId()
                        )).collect(Collectors.toList());

                evaluationDTO = new EvaluationDTO(
                        evaluation.getId(),
                        evaluation.getNoteScientifique(),
                        evaluation.getNoteIndividu(),
                        evaluation.getNoteEntreprise(),
                        evaluation.getStage().getId(),
                        evaluation.getImplicationActivites(), 
                        evaluation.getOuvertureAuxAutres(),  
                        evaluation.getQualiteProductions(),  
                        evaluation.getObservationsTravail(),
                        competenceEvaluationDTOs,
                        competenceSpecifiqueEvaluationDTOs
                );
            }

            return new StageEvaluationResponseDTO(
                    stageDTO,
                    evaluationDTO,
                    competenceDTOs,
                    competenceEvaluationDTOs,
                    competenceSpecifiqueEvaluationDTOs,
                    stagiaireDTO,
                    tuteurDTO
            );
        }).collect(Collectors.toList());
    }

    
    
    
   
    
    
    @Override
    public EvaluationDTO createEvaluation(EvaluationDTO evaluationDTO) {
    	
    	 Evaluation existingEvaluation = evaluationRepository.findByStageId(evaluationDTO.getStageId());
    	    if (existingEvaluation != null) {
    	        throw new RuntimeException("Une évaluation existe déjà pour ce stage.");
    	    }

        Evaluation evaluation = new Evaluation();
        evaluation.setNoteScientifique(evaluationDTO.getNoteScientifique());
        evaluation.setNoteIndividu(evaluationDTO.getNoteIndividu());
        evaluation.setNoteEntreprise(evaluationDTO.getNoteEntreprise());

        Stage stage = stageRepository.findById(evaluationDTO.getStageId())
                .orElseThrow(() -> new RuntimeException("Stage introuvable avec l'ID : " + evaluationDTO.getStageId()));
        evaluation.setStage(stage);

        evaluation.setImplicationActivites(evaluationDTO.getImplicationActivites());
        evaluation.setOuvertureAuxAutres(evaluationDTO.getOuvertureAuxAutres());
        evaluation.setQualiteProductions(evaluationDTO.getQualiteProductions());
        evaluation.setObservationsTravail(evaluationDTO.getObservationsTravail());

        evaluation = evaluationService.save(evaluation);

        if (evaluationDTO.getCompetenceEvaluations() != null) {
            for (CompetenceEvaluationDTO ceDTO : evaluationDTO.getCompetenceEvaluations()) {
                CompetenceEvaluation competenceEvaluation = new CompetenceEvaluation();
                competenceEvaluation.setEvaluation(evaluation);
                competenceEvaluation.setCompetence(competenceService.findById(ceDTO.getCompetenceId()));
                competenceEvaluation.setNiveau(ceDTO.getNiveau());
                competenceEvaluationRepository.save(competenceEvaluation);
            }
        }

        if (evaluationDTO.getCompetencesSpecifiques() != null) {
            for (CompetenceSpecifiqueEvaluationDTO cseDTO : evaluationDTO.getCompetencesSpecifiques()) {
                CompetenceSpecifiqueEvaluation competenceSpecifique = new CompetenceSpecifiqueEvaluation();
                competenceSpecifique.setEvaluation(evaluation);
                competenceSpecifique.setIntitule(cseDTO.getIntitule());
                competenceSpecifique.setNiveau(cseDTO.getNiveau());
                competenceSpecifiqueEvaluationRepository.save(competenceSpecifique);
            }
        }

        return new EvaluationDTO(
                evaluation.getId(),
                evaluation.getNoteScientifique(),
                evaluation.getNoteIndividu(),
                evaluation.getNoteEntreprise(),
                evaluation.getStage().getId(),
                evaluation.getImplicationActivites(),
                evaluation.getOuvertureAuxAutres(),
                evaluation.getQualiteProductions(),
                evaluation.getObservationsTravail(),
                evaluationDTO.getCompetenceEvaluations(),
                evaluationDTO.getCompetencesSpecifiques()
        );
    }
    
    @Transactional
    @Override
    public EvaluationDTO updateEvaluation(Long evaluationId, EvaluationDTO evaluationDTO) {
        Evaluation evaluation = evaluationService.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Évaluation introuvable avec l'ID : " + evaluationId));

        evaluation.setNoteScientifique(evaluationDTO.getNoteScientifique());
        evaluation.setNoteIndividu(evaluationDTO.getNoteIndividu());
        evaluation.setNoteEntreprise(evaluationDTO.getNoteEntreprise());
        evaluation.setImplicationActivites(evaluationDTO.getImplicationActivites());
        evaluation.setOuvertureAuxAutres(evaluationDTO.getOuvertureAuxAutres());
        evaluation.setQualiteProductions(evaluationDTO.getQualiteProductions());
        evaluation.setObservationsTravail(evaluationDTO.getObservationsTravail());

        evaluation = evaluationService.save(evaluation);

        competenceEvaluationRepository.deleteByEvaluationId(evaluationId);
        competenceSpecifiqueEvaluationRepository.deleteByEvaluationId(evaluationId);

        if (evaluationDTO.getCompetenceEvaluations() != null) {
            for (CompetenceEvaluationDTO ceDTO : evaluationDTO.getCompetenceEvaluations()) {
                CompetenceEvaluation ce = new CompetenceEvaluation();
                ce.setEvaluation(evaluation);
                ce.setCompetence(competenceService.findById(ceDTO.getCompetenceId()));
                ce.setNiveau(ceDTO.getNiveau());
                competenceEvaluationRepository.save(ce);
            }
        }

        if (evaluationDTO.getCompetencesSpecifiques() != null) {
            for (CompetenceSpecifiqueEvaluationDTO cseDTO : evaluationDTO.getCompetencesSpecifiques()) {
                CompetenceSpecifiqueEvaluation cse = new CompetenceSpecifiqueEvaluation();
                cse.setEvaluation(evaluation);
                cse.setIntitule(cseDTO.getIntitule());
                cse.setNiveau(cseDTO.getNiveau());
                competenceSpecifiqueEvaluationRepository.save(cse);
            }
        }

        return new EvaluationDTO(
            evaluation.getId(),
            evaluation.getNoteScientifique(),
            evaluation.getNoteIndividu(),
            evaluation.getNoteEntreprise(),
            evaluation.getStage().getId(),
            evaluation.getImplicationActivites(),
            evaluation.getOuvertureAuxAutres(),
            evaluation.getQualiteProductions(),
            evaluation.getObservationsTravail(),
            evaluationDTO.getCompetenceEvaluations(),
            evaluationDTO.getCompetencesSpecifiques()
        );
    }

    @Transactional
    @Override
    public void deleteEvaluation(Long evaluationId) {
        if (!evaluationService.existsById(evaluationId)) {
            throw new RuntimeException("Évaluation introuvable avec l'ID : " + evaluationId);
        }
        Evaluation evaluation = evaluationService.findById(evaluationId).orElseThrow();
        Stage stage = evaluation.getStage();
        if (stage != null) {
            stage.setEvaluation(null);
        }
        evaluationService.deleteById(evaluationId);
    }

    
   

 


}
