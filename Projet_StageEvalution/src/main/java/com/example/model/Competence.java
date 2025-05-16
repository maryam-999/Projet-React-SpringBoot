package com.example.model;

import com.example.enumerations.CategorieCompetence;

import jakarta.persistence.*;

@Entity
public class Competence {
    @Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY) //auto-incrementation 
    private Long id;

    private String intitule;

    @Enumerated(EnumType.STRING)
    private CategorieCompetence categorie;

    public Competence() {}

    public Competence(String intitule, CategorieCompetence categorie) {
        this.intitule = intitule;
        this.categorie = categorie;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIntitule() { return intitule; }
    public void setIntitule(String intitule) { this.intitule = intitule; }

    public CategorieCompetence getCategorie() { return categorie; }
    public void setCategorie(CategorieCompetence categorie) { this.categorie = categorie; }
}
