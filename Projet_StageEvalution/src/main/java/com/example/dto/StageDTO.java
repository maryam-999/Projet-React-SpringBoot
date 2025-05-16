package com.example.dto;

import java.time.LocalDate;

import com.example.model.User;

public class StageDTO {
    private Long id;
    private String theme;
    private String objectif;
    private String entreprise;
    private LocalDate dateDebut; 
    private LocalDate dateFin;  
    private Long stagiaireId;
    private Long tuteurId;
    private User stagiaire;
    private User tuteur;
    
	public StageDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public StageDTO(Long id, String theme, String objectif, String entreprise, LocalDate dateDebut, LocalDate dateFin,
			Long stagiaireId, Long tuteurId) {
		super();
		this.id = id;
		this.theme = theme;
		this.objectif = objectif;
		this.entreprise = entreprise;
		this.dateDebut = dateDebut;
		this.dateFin = dateFin;
		this.stagiaireId = stagiaireId;
		this.tuteurId = tuteurId;
	}
	
	public StageDTO(Long id, String theme, String objectif, String entreprise, LocalDate dateDebut, LocalDate dateFin,
			User stagiaire, User tuteur) {
		super();
		this.id = id;
		this.theme = theme;
		this.objectif = objectif;
		this.entreprise = entreprise;
		this.dateDebut = dateDebut;
		this.dateFin = dateFin;
		this.stagiaire = stagiaire;
		this.tuteur = tuteur;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTheme() {
		return theme;
	}
	public void setTheme(String theme) {
		this.theme = theme;
	}
	public String getObjectif() {
		return objectif;
	}
	public void setObjectif(String objectif) {
		this.objectif = objectif;
	}
	public String getEntreprise() {
		return entreprise;
	}
	public void setEntreprise(String entreprise) {
		this.entreprise = entreprise;
	}
	public LocalDate getDateDebut() {
		return dateDebut;
	}
	public void setDateDebut(LocalDate dateDebut) {
		this.dateDebut = dateDebut;
	}
	public LocalDate getDateFin() {
		return dateFin;
	}
	public void setDateFin(LocalDate dateFin) {
		this.dateFin = dateFin;
	}
	public Long getStagiaireId() {
		return stagiaireId;
	}
	public void setStagiaireId(Long stagiaireId) {
		this.stagiaireId = stagiaireId;
	}
	public Long getTuteurId() {
		return tuteurId;
	}
	public void setTuteurId(Long tuteurId) {
		this.tuteurId = tuteurId;
	}

	public User getStagiaire() {
		return stagiaire;
	}

	public void setStagiaire(User stagiaire) {
		this.stagiaire = stagiaire;
	}

	public User getTuteur() {
		return tuteur;
	}

	public void setTuteur(User tuteur) {
		this.tuteur = tuteur;
	}
    
}