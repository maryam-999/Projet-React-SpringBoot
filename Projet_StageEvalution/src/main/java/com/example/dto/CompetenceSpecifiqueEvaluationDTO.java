package com.example.dto;

import com.example.enumerations.NiveauMetier;

public class CompetenceSpecifiqueEvaluationDTO {
    private Long id;
    private String intitule;
    private NiveauMetier niveau;
    private Long evaluationId;

    public CompetenceSpecifiqueEvaluationDTO() {}

    public CompetenceSpecifiqueEvaluationDTO(Long id, String intitule, NiveauMetier niveau, Long evaluationId) {
        this.id = id;
        this.intitule = intitule;
        this.niveau = niveau;
        this.evaluationId = evaluationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIntitule() { return intitule; }
    public void setIntitule(String intitule) { this.intitule = intitule; }

    public NiveauMetier getNiveau() { return niveau; }
    public void setNiveau(NiveauMetier niveau) { this.niveau = niveau; }

    public Long getEvaluationId() { return evaluationId; }
    public void setEvaluationId(Long evaluationId) { this.evaluationId = evaluationId; }
}
