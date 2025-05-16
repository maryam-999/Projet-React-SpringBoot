package com.example.model;

import com.example.enumerations.NiveauCompetence;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
public class CompetenceEvaluation {
    @Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY) //auto-incrementation 
    private Long id;

    @ManyToOne
    private Competence competence;

    @Enumerated(EnumType.STRING)
    private NiveauCompetence niveau;

    @ManyToOne
    @JsonBackReference(value = "evaluation-competence")
    private Evaluation evaluation;
    
    public CompetenceEvaluation() {}

    public CompetenceEvaluation(Competence competence, NiveauCompetence niveau) {
        this.competence = competence;
        this.niveau = niveau;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Competence getCompetence() { return competence; }
    public void setCompetence(Competence competence) { this.competence = competence; }

    public NiveauCompetence getNiveau() { return niveau; }
    public void setNiveau(NiveauCompetence niveau) { this.niveau = niveau; }

    public Evaluation getEvaluation() { return evaluation; }
    public void setEvaluation(Evaluation evaluation) { this.evaluation = evaluation; }
}
