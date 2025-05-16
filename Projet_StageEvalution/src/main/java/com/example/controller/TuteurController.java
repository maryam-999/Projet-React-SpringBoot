package com.example.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.CompetenceDTO;
import com.example.dto.EvaluationDTO;
import com.example.dto.StageEvaluationResponseDTO;
import com.example.dto.UserDTO;
import com.example.enumerations.CategorieCompetence;
import com.example.enumerations.Role;
import com.example.model.Reunion;
import com.example.service.ReunionService;
import com.example.service.StagiaireTuteurService;

@RestController
@RequestMapping("/api/tuteur")
public class TuteurController {
	

	    @Autowired
	    private StagiaireTuteurService stagiaireTuteurService;
	    
	   
	    
	    @GetMapping("/myprofile")
        public ResponseEntity<UserDTO> getProfile(@RequestHeader("Authorization") String token) {
            UserDTO userDto = stagiaireTuteurService.getProfile(token);
            return ResponseEntity.ok(userDto);
        }

	    @GetMapping("/stages-evaluation/{tuteurId}")
	    public ResponseEntity<?> getStagesWithEvaluations(@PathVariable Long tuteurId) {
	        try {
	            List<StageEvaluationResponseDTO> result = stagiaireTuteurService
	                .getStagesWithEvaluationsByUserIdAndRole(tuteurId, Role.TUTEUR);
	            return ResponseEntity.ok(result);
	        } catch (RuntimeException e) {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body(Collections.singletonMap("message", e.getMessage()));
	        }
	    }
	    
	    @PostMapping("/evaluation")
	    public ResponseEntity<?> createEvaluation(@RequestBody EvaluationDTO evaluationDTO) {
	        try {
	            EvaluationDTO createdEvaluation = stagiaireTuteurService.createEvaluation(evaluationDTO);
	            return ResponseEntity.ok(createdEvaluation);
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body(Collections.singletonMap("message", "Erreur lors de la création de l'évaluation : " + e.getMessage()));
	        }
	    }

	    @DeleteMapping("/evaluation/{id}")
	    public ResponseEntity<?> deleteEvaluation(@PathVariable Long id) {
	        try {
	            stagiaireTuteurService.deleteEvaluation(id);
	            return ResponseEntity.ok(Collections.singletonMap("message", "Évaluation supprimée avec succès."));
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body(Collections.singletonMap("message", "Erreur lors de la suppression de l'évaluation : " + e.getMessage()));
	        }
	    }
	    
	    @PutMapping("/evaluation/{id}")
	    public ResponseEntity<?> updateEvaluation(@PathVariable Long id, @RequestBody EvaluationDTO evaluationDTO) {
	        try {
	            EvaluationDTO updatedEvaluation = stagiaireTuteurService.updateEvaluation(id, evaluationDTO);
	            return ResponseEntity.ok(updatedEvaluation);
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body(Collections.singletonMap("message", "Erreur lors de la mise à jour de l'évaluation : " + e.getMessage()));
	        }
	    }
	    
	    
	    @GetMapping("/competences/{categorie}")
	    public ResponseEntity<List<CompetenceDTO>> getCompetencesByCategorie(@PathVariable CategorieCompetence categorie) {
	        List<CompetenceDTO> competences = stagiaireTuteurService.getCompetencesByCategorie(categorie);
	        return ResponseEntity.ok(competences);
	    }

	    
	   
	      
	    
	}


























