package com.example.model;


import java.util.ArrayList;
import java.util.List;

import com.example.enumerations.Role;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class User {
	    @Id 
		@GeneratedValue(strategy = GenerationType.IDENTITY) //auto-incrementation 
	    private Long id;
	    
	    private String nom;
	    private String prenom;
	    
	    @Column(unique = true, nullable = false)
	    private String email;
	    private String password;

	    @Enumerated(EnumType.STRING)
	    private Role role;  // TUTEUR, STAGIAIRE

	    private String entreprise; // (Tuteur)
	    private String institution; // (Stagiaire)
	    
	    
	    @OneToMany(mappedBy = "tuteur", cascade = CascadeType.ALL, orphanRemoval = true)
	    @JsonManagedReference(value = "tuteur-stages")
	    private List<Stage> stagesEncadres = new ArrayList<>();

	    @OneToMany(mappedBy = "stagiaire", cascade = CascadeType.ALL, orphanRemoval = true)
	    @JsonManagedReference(value = "stagiaire-stages")
	    private List<Stage> stagesSuivis = new ArrayList<>();
		
	    
	    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	    @JsonManagedReference(value = "user-reunions")
	    private List<Reunion> reunions = new ArrayList<>();
	    
	    public User() {
			super();
			// TODO Auto-generated constructor stub
		}
		public User(Long id, String nom, String prenom, String email, String password, Role role, String entreprise,
				String institution) {
			this.id = id;
			this.nom = nom;
			this.prenom = prenom;
			this.email = email;
			this.password = password;
			this.role = role;
			this.entreprise = entreprise;
			this.institution = institution;
		}

		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public String getNom() {
			return nom;
		}
		public void setNom(String nom) {
			this.nom = nom;
		}
		public String getPrenom() {
			return prenom;
		}
		public void setPrenom(String prenom) {
			this.prenom = prenom;
		}
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public String getPassword() {
			return password;
		}
		public void setPassword(String password) {
			this.password = password;
		}
		public Role getRole() {
			return role;
		}
		public void setRole(Role role) {
			this.role = role;
		}
		public String getEntreprise() {
			return entreprise;
		}
		public void setEntreprise(String entreprise) {
			this.entreprise = entreprise;
		}
		public String getInstitution() {
			return institution;
		}
		public void setInstitution(String institution) {
			this.institution = institution;
		}
	    
		public List<Reunion> getReunions() {
		    return reunions;
		}

		public void setReunions(List<Reunion> reunions) {
		    this.reunions = reunions;
		}
		
	}
