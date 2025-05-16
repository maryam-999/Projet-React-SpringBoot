package com.example.dto;

import java.util.List;

public class StageEvaluationResponseDTO {
    private StageDTO stage;
    private EvaluationDTO evaluation;
    private List<CompetenceDTO> competences;
    private List<CompetenceEvaluationDTO> competenceEvaluations;
    private List<CompetenceSpecifiqueEvaluationDTO> competenceSpecifiqueEvaluations;
    private UserDTO stagiaire;
    private UserDTO tuteur;

    // Constructeur complet :
    public StageEvaluationResponseDTO(
            StageDTO stage,
            EvaluationDTO evaluation,
            List<CompetenceDTO> competences,
            List<CompetenceEvaluationDTO> competenceEvaluations,
            List<CompetenceSpecifiqueEvaluationDTO> competenceSpecifiqueEvaluations,
            UserDTO stagiaire,
            UserDTO tuteur
    ) {
        this.stage = stage;
        this.evaluation = evaluation;
        this.competences = competences;
        this.competenceEvaluations = competenceEvaluations;
        this.competenceSpecifiqueEvaluations = competenceSpecifiqueEvaluations;
        this.stagiaire = stagiaire;
        this.tuteur = tuteur;
    }
    
    // Getters & Setters
    public StageDTO getStage() { return stage; }
    public void setStage(StageDTO stage) { this.stage = stage; }

    public EvaluationDTO getEvaluation() { return evaluation; }
    public void setEvaluation(EvaluationDTO evaluation) { this.evaluation = evaluation; }

    public List<CompetenceDTO> getCompetences() { return competences; }
    public void setCompetences(List<CompetenceDTO> competences) { this.competences = competences; }

    public List<CompetenceEvaluationDTO> getCompetenceEvaluations() { return competenceEvaluations; }
    public void setCompetenceEvaluations(List<CompetenceEvaluationDTO> competenceEvaluations) { this.competenceEvaluations = competenceEvaluations; }

    public List<CompetenceSpecifiqueEvaluationDTO> getCompetenceSpecifiqueEvaluations() { return competenceSpecifiqueEvaluations; }
    public void setCompetenceSpecifiqueEvaluations(List<CompetenceSpecifiqueEvaluationDTO> competenceSpecifiqueEvaluations) { this.competenceSpecifiqueEvaluations = competenceSpecifiqueEvaluations; }

    public UserDTO getStagiaire() { return stagiaire; }
    public void setStagiaire(UserDTO stagiaire) { this.stagiaire = stagiaire; }

    public UserDTO getTuteur() { return tuteur; }
    public void setTuteur(UserDTO tuteur) { this.tuteur = tuteur; }
}
