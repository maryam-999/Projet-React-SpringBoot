package com.example.dto;


import java.util.List;
import java.util.Map;

public class StatisticsTuteurDTO {
	   private long totalStagesEncadres;
	   private long stagesEnCours;
	   private long stagesTermines;
	   private long evaluationsEffectuees;
	   private long evaluationsRestantes;
       private Map<String, Long> repartitionParInstitution;
       private Map<String, Long> stagesParMois;
       

       public StatisticsTuteurDTO(long totalStagesEncadres, long stagesEnCours, long stagesTermines,
               long evaluationsEffectuees, long evaluationsRestantes,
               Map<String, Long> repartitionParInstitution,
               Map<String, Long> stagesParMois) {
    	   this.totalStagesEncadres = totalStagesEncadres;
    	   this.stagesEnCours = stagesEnCours;
    	   this.stagesTermines = stagesTermines;
    	   this.evaluationsEffectuees = evaluationsEffectuees;
    	   this.evaluationsRestantes = evaluationsRestantes;
    	   this.repartitionParInstitution = repartitionParInstitution;
    	   this.stagesParMois = stagesParMois;
}
	public StatisticsTuteurDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public long getTotalStagesEncadres() {
	    return totalStagesEncadres;
	}

	public void setTotalStagesEncadres(long totalStagesEncadres) {
	    this.totalStagesEncadres = totalStagesEncadres;
	}

	public long getStagesEnCours() {
	    return stagesEnCours;
	}

	public void setStagesEnCours(long stagesEnCours) {
	    this.stagesEnCours = stagesEnCours;
	}

	public long getStagesTermines() {
	    return stagesTermines;
	}

	public void setStagesTermines(long stagesTermines) {
	    this.stagesTermines = stagesTermines;
	}

	public long getEvaluationsEffectuees() {
	    return evaluationsEffectuees;
	}

	public void setEvaluationsEffectuees(long evaluationsEffectuees) {
	    this.evaluationsEffectuees = evaluationsEffectuees;
	}

	public long getEvaluationsRestantes() {
	    return evaluationsRestantes;
	}

	public void setEvaluationsRestantes(long evaluationsRestantes) {
	    this.evaluationsRestantes = evaluationsRestantes;
	}

	public Map<String, Long> getRepartitionParInstitution() {
	    return repartitionParInstitution;
	}

	public void setRepartitionParInstitution(Map<String, Long> repartitionParInstitution) {
	    this.repartitionParInstitution = repartitionParInstitution;
	}

	public Map<String, Long> getStagesParMois() {
	    return stagesParMois;
	}

	public void setStagesParMois(Map<String, Long> stagesParMois) {
	    this.stagesParMois = stagesParMois;
	}
	
       
       
}
