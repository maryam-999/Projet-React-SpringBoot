package com.example.model;

import java.util.List;

import com.example.enumerations.NiveauMetier;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class CompetenceSpecifiqueEvaluation {
    @Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY) //auto-incrementation 
    private Long id;

    private String intitule; // Ex: "Développement Spring Boot", "Gestion de projet Agile"

    @Enumerated(EnumType.STRING)
    private NiveauMetier niveau;

    @ManyToOne
    @JsonBackReference(value = "evaluation-competenceSpecifique")
    private Evaluation evaluation;
    
    public CompetenceSpecifiqueEvaluation() {}

    public CompetenceSpecifiqueEvaluation(String intitule, NiveauMetier niveau) {
        this.intitule = intitule;
        this.niveau = niveau;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getIntitule() {
		return intitule;
	}

	public void setIntitule(String intitule) {
		this.intitule = intitule;
	}

	public NiveauMetier getNiveau() {
		return niveau;
	}

	public void setNiveau(NiveauMetier niveau) {
		this.niveau = niveau;
	}

	public Evaluation getEvaluation() {
		return evaluation;
	}

	public void setEvaluation(Evaluation evaluation) {
		this.evaluation = evaluation;
	}
    
}
