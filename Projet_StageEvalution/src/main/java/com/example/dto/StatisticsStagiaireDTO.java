package com.example.dto;

import java.util.Map;

public class StatisticsStagiaireDTO {
    private long totalStages;
    private long stagesEnCours;
    private long stagesAVenir;
    private long stagesEvalues;
    private long stagesNonEvalues;
    private long nbEntreprisesDifferentes;
    private Map<String, Long> stagesParEntreprise;
    private Map<String, Long> stagesParTuteur;

    // Getters & Setters
    public long getTotalStages() {
        return totalStages;
    }

    public void setTotalStages(long totalStages) {
        this.totalStages = totalStages;
    }

    public long getStagesEnCours() {
        return stagesEnCours;
    }

    public void setStagesEnCours(long stagesEnCours) {
        this.stagesEnCours = stagesEnCours;
    }

    public long getStagesAVenir() {
        return stagesAVenir;
    }

    public void setStagesAVenir(long stagesAVenir) {
        this.stagesAVenir = stagesAVenir;
    }

    public long getStagesEvalues() {
        return stagesEvalues;
    }

    public void setStagesEvalues(long stagesEvalues) {
        this.stagesEvalues = stagesEvalues;
    }

    public long getStagesNonEvalues() {
        return stagesNonEvalues;
    }

    public void setStagesNonEvalues(long stagesNonEvalues) {
        this.stagesNonEvalues = stagesNonEvalues;
    }

    public long getNbEntreprisesDifferentes() {
        return nbEntreprisesDifferentes;
    }

    public void setNbEntreprisesDifferentes(long nbEntreprisesDifferentes) {
        this.nbEntreprisesDifferentes = nbEntreprisesDifferentes;
    }

    public Map<String, Long> getStagesParEntreprise() {
        return stagesParEntreprise;
    }

    public void setStagesParEntreprise(Map<String, Long> stagesParEntreprise) {
        this.stagesParEntreprise = stagesParEntreprise;
    }

    public Map<String, Long> getStagesParTuteur() {
        return stagesParTuteur;
    }

    public void setStagesParTuteur(Map<String, Long> stagesParTuteur) {
        this.stagesParTuteur = stagesParTuteur;
    }
}
