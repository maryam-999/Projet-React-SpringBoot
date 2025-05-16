package com.example.model;

import jakarta.persistence.*;
import java.util.List;

import com.example.enumerations.ImplicationActivites;
import com.example.enumerations.OuvertureAuxAutres;
import com.example.enumerations.QualiteProductions;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Evaluation {
    @Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY) //auto-incrementation 
    private Long id;

    @OneToOne
    @JoinColumn(name = "stage_id")
    @JsonBackReference
    private Stage stage;
    
    private Double noteIndividu;
    private Double noteEntreprise;
    private Double noteScientifique;
    

    @Enumerated(EnumType.STRING)
    private ImplicationActivites implicationActivites;

    @Enumerated(EnumType.STRING)
    private OuvertureAuxAutres ouvertureAuxAutres;

    @Enumerated(EnumType.STRING)
    private QualiteProductions qualiteProductions;
	
	@Column(length = 1000)
    private String observationsTravail;

    
    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "evaluation-competence")
    private List<CompetenceEvaluation> competenceEvaluations;
    
    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "evaluation-competenceSpecifique")
    private List<CompetenceSpecifiqueEvaluation> competencesSpecifiques;
    
    
    public Evaluation() {}

    public Evaluation(Stage stage) {
        this.stage = stage;
    }

    // Getters & Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Stage getStage() { return stage; }
    public void setStage(Stage stage) { this.stage = stage; }

    public Double getNoteIndividu() { return noteIndividu; }
    public void setNoteIndividu(Double noteIndividu) { this.noteIndividu = noteIndividu; }

    public Double getNoteEntreprise() { return noteEntreprise; }
    public void setNoteEntreprise(Double noteEntreprise) { this.noteEntreprise = noteEntreprise; }

    public Double getNoteScientifique() { return noteScientifique; }
    public void setNoteScientifique(Double noteScientifique) { this.noteScientifique = noteScientifique; }

    public List<CompetenceEvaluation> getCompetenceEvaluations() { return competenceEvaluations; }
    public void setCompetenceEvaluations(List<CompetenceEvaluation> competenceEvaluations) { this.competenceEvaluations = competenceEvaluations; }

	public ImplicationActivites getImplicationActivites() {
		return implicationActivites;
	}

	public void setImplicationActivites(ImplicationActivites implicationActivites) {
		this.implicationActivites = implicationActivites;
	}

	public OuvertureAuxAutres getOuvertureAuxAutres() {
		return ouvertureAuxAutres;
	}

	public void setOuvertureAuxAutres(OuvertureAuxAutres ouvertureAuxAutres) {
		this.ouvertureAuxAutres = ouvertureAuxAutres;
	}

	public QualiteProductions getQualiteProductions() {
		return qualiteProductions;
	}

	public void setQualiteProductions(QualiteProductions qualiteProductions) {
		this.qualiteProductions = qualiteProductions;
	}

	public List<CompetenceSpecifiqueEvaluation> getCompetencesSpecifiques() {
		return competencesSpecifiques;
	}

	public void setCompetencesSpecifiques(List<CompetenceSpecifiqueEvaluation> competencesSpecifiques) {
		this.competencesSpecifiques = competencesSpecifiques;
	}

	public String getObservationsTravail() {
		return observationsTravail;
	}

	public void setObservationsTravail(String observationsTravail) {
		this.observationsTravail = observationsTravail;
	}

    
}
