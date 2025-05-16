package com.example.dto;

import java.util.List;

import com.example.enumerations.ImplicationActivites;
import com.example.enumerations.OuvertureAuxAutres;
import com.example.enumerations.QualiteProductions;




public class EvaluationDTO {
    private Long id;
    private Double noteScientifique;
    private Double noteIndividu;
    private Double noteEntreprise;
    private Long stageId;
    private ImplicationActivites implicationActivites;
    private OuvertureAuxAutres ouvertureAuxAutres;
    private QualiteProductions qualiteProductions;
    private String observationsTravail;
    private List<CompetenceEvaluationDTO> competenceEvaluations;
    private List<CompetenceSpecifiqueEvaluationDTO> competencesSpecifiques;

    
    public EvaluationDTO() {
    }

    public EvaluationDTO(Long id, Double noteScientifique, Double noteIndividu, Double noteEntreprise, Long stageId) {
        this.id = id;
        this.noteScientifique = noteScientifique;
        this.noteIndividu = noteIndividu;
        this.noteEntreprise = noteEntreprise;
        this.stageId = stageId;
    }
    
    public EvaluationDTO(Long id, Double noteScientifique, Double noteIndividu, Double noteEntreprise, Long stageId, ImplicationActivites implicationActivites,
            OuvertureAuxAutres ouvertureAuxAutres, QualiteProductions qualiteProductions,
            String observationsTravail,
            List<CompetenceEvaluationDTO> competenceEvaluations,
            List<CompetenceSpecifiqueEvaluationDTO> competencesSpecifiques) {
        this.id = id;
        this.noteScientifique = noteScientifique;
        this.noteIndividu = noteIndividu;
        this.noteEntreprise = noteEntreprise;
        this.stageId = stageId;
        this.implicationActivites = implicationActivites;
        this.ouvertureAuxAutres = ouvertureAuxAutres;
        this.qualiteProductions = qualiteProductions;
        this.observationsTravail = observationsTravail;
        this.competenceEvaluations = competenceEvaluations;
        this.competencesSpecifiques = competencesSpecifiques;
    }
    
    
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

	public String getObservationsTravail() {
		return observationsTravail;
	}

	public void setObservationsTravail(String observationsTravail) {
		this.observationsTravail = observationsTravail;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getNoteScientifique() {
        return noteScientifique;
    }

    public void setNoteScientifique(Double noteScientifique) {
        this.noteScientifique = noteScientifique;
    }

    public Double getNoteIndividu() {
        return noteIndividu;
    }

    public void setNoteIndividu(Double noteIndividu) {
        this.noteIndividu = noteIndividu;
    }

    public Double getNoteEntreprise() {
        return noteEntreprise;
    }

    public void setNoteEntreprise(Double noteEntreprise) {
        this.noteEntreprise = noteEntreprise;
    }

    public Long getStageId() {
        return stageId;
    }

    public void setStageId(Long stageId) {
        this.stageId = stageId;
    }
    

    public List<CompetenceEvaluationDTO> getCompetenceEvaluations() {
        return competenceEvaluations;
    }

    public void setCompetenceEvaluations(List<CompetenceEvaluationDTO> competenceEvaluations) {
        this.competenceEvaluations = competenceEvaluations;
    }

    public List<CompetenceSpecifiqueEvaluationDTO> getCompetencesSpecifiques() {
        return competencesSpecifiques;
    }

    public void setCompetencesSpecifiques(List<CompetenceSpecifiqueEvaluationDTO> competencesSpecifiques) {
        this.competencesSpecifiques = competencesSpecifiques;
    }
}




