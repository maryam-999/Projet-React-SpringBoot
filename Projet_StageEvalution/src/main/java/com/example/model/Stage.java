package com.example.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class Stage {
	
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY) //auto-incrementation 
    private Long id;

    private String theme;
    private String objectif;
    private String entreprise;

    private LocalDate dateDebut; // DB
    private LocalDate dateFin;   // DF

    @OneToOne(mappedBy = "stage", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Evaluation evaluation;

    @ManyToOne
    @JoinColumn(name = "id_tuteur", nullable = false)
    @JsonBackReference(value = "tuteur-stages")
    private User tuteur;

    @ManyToOne
    @JoinColumn(name = "id_stagiaire", nullable = false)
    @JsonBackReference(value = "stagiaire-stages")
    private User stagiaire;
    
	public Stage() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Stage(Long id, String theme, String objectif, String entreprise, LocalDate dateDebut, LocalDate dateFin,
			User tuteur, User stagiaire) {
		this.id = id;
		this.theme = theme;
		this.objectif = objectif;
		this.entreprise = entreprise;
		this.dateDebut = dateDebut;
		this.dateFin = dateFin;
		this.tuteur = tuteur;
		this.stagiaire = stagiaire;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Evaluation getEvaluation() {
		return evaluation;
	}
	public void setEvaluation(Evaluation evaluation) {
		this.evaluation = evaluation;
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

	public User getTuteur() {
		return tuteur;
	}

	public void setTuteur(User tuteur) {
		this.tuteur = tuteur;
	}

	public User getStagiaire() {
		return stagiaire;
	}

	public void setStagiaire(User stagiaire) {
		this.stagiaire = stagiaire;
	}
    
}
