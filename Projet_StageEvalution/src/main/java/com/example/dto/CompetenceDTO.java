package com.example.dto;

import com.example.enumerations.CategorieCompetence;

public class CompetenceDTO {
    private Long id;
    private String intitule;
    private CategorieCompetence categorie; // exemple: INDIVIDU, ENTREPRISE, SCIENTIFIQUE_TECHNIQUE
	
    public CompetenceDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public CompetenceDTO(Long id, String intitule, CategorieCompetence categorie) {
		super();
		this.id = id;
		this.intitule = intitule;
		this.categorie = categorie;
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
	public CategorieCompetence getCategorie() {
		return categorie;
	}
	public void setCategorie(CategorieCompetence categorie) {
		this.categorie = categorie;
	}

}
