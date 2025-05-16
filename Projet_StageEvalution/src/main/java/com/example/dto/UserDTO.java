package com.example.dto;

import com.example.enumerations.Role;

public class UserDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String password;
    private String entreprise; 
    private String institution;
    private Role role;

    public UserDTO() {}

    public UserDTO(Long id, String nom, String prenom, String email, String password, String entreprise, String institution, Role role) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.entreprise = entreprise;
        this.institution = institution;
        this.role = role;
    }
    
    public UserDTO(Long id, String nom, String prenom, String email,String entreprise, String institution, Role role) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.entreprise = entreprise;
        this.institution = institution;
        this.role = role;
    }

	// Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
