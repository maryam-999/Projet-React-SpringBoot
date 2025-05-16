package com.example.dto;

import com.example.enumerations.NiveauCompetence;

public class CompetenceEvaluationDTO {
	private Long id;
	private Long competenceId;
    private Long evaluationId;
    private NiveauCompetence niveau; // NA, DEBUTANT, AUTONOME, AUTONOME+
	
    
    
    public CompetenceEvaluationDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public CompetenceEvaluationDTO(Long id, Long competenceId, Long evaluationId, NiveauCompetence niveau) {
		super();
		this.id = id;
		this.competenceId = competenceId;
		this.evaluationId = evaluationId;
		this.niveau = niveau;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getCompetenceId() {
		return competenceId;
	}
	public void setCompetenceId(Long competenceId) {
		this.competenceId = competenceId;
	}
	public Long getEvaluationId() {
		return evaluationId;
	}
	public void setEvaluationId(Long evaluationId) {
		this.evaluationId = evaluationId;
	}
	public NiveauCompetence getNiveau() {
		return niveau;
	}
	public void setNiveau(NiveauCompetence niveau) {
		this.niveau = niveau;
	}


}