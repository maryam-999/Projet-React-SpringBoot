package com.example.dto;

import java.util.Map;

public class StatisticsAdminDTO {
	   private long totalStagiaires;
	    private long stagiairesEnCours;
	    private long totalTuteurs;
	    private long totalStages;
	    private Map<String, Long> repartitionRoles;
	    private Map<String, Long> repartitionStagiairesParInstitution;
	    private Map<String, Long> repartitionTuteursParEntreprise;

	    // Getters & setters
	    public long getTotalStagiaires() {
	        return totalStagiaires;
	    }

	    public void setTotalStagiaires(long totalStagiaires) {
	        this.totalStagiaires = totalStagiaires;
	    }

	    public long getStagiairesEnCours() {
	        return stagiairesEnCours;
	    }

	    public void setStagiairesEnCours(long stagiairesEnCours) {
	        this.stagiairesEnCours = stagiairesEnCours;
	    }

	    public long getTotalTuteurs() {
	        return totalTuteurs;
	    }

	    public void setTotalTuteurs(long totalTuteurs) {
	        this.totalTuteurs = totalTuteurs;
	    }

	    public long getTotalStages() {
	        return totalStages;
	    }

	    public void setTotalStages(long totalStages) {
	        this.totalStages = totalStages;
	    }

	    public Map<String, Long> getRepartitionRoles() {
	        return repartitionRoles;
	    }

	    public void setRepartitionRoles(Map<String, Long> repartitionRoles) {
	        this.repartitionRoles = repartitionRoles;
	    }

	    public Map<String, Long> getRepartitionStagiairesParInstitution() {
	        return repartitionStagiairesParInstitution;
	    }

	    public void setRepartitionStagiairesParInstitution(Map<String, Long> repartitionStagiairesParInstitution) {
	        this.repartitionStagiairesParInstitution = repartitionStagiairesParInstitution;
	    }

	    public Map<String, Long> getRepartitionTuteursParEntreprise() {
	        return repartitionTuteursParEntreprise;
	    }

	    public void setRepartitionTuteursParEntreprise(Map<String, Long> repartitionTuteursParEntreprise) {
	        this.repartitionTuteursParEntreprise = repartitionTuteursParEntreprise;
	    }
}
