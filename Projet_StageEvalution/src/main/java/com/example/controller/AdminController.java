package com.example.controller;

import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.service.AdminService;
import com.example.service.ReunionService;
import com.example.dto.StageDTO;
import com.example.dto.UserDTO;
import com.example.enumerations.Role;
import com.example.model.Competence;
import com.example.model.Reunion;
import com.example.model.Stage;
import com.example.model.User;


@RestController
@RequestMapping("/api/admin")
public class AdminController {
	
    @Autowired
    private AdminService adminService;
 
   
    
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDto) {
        try {
            String result = adminService.register(userDto);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    
    @GetMapping("/tuteurs/entreprise")
    public ResponseEntity<List<User>> getTuteursByEntreprise(@RequestParam String entreprise) {
        List<User> tuteurs = adminService.getTuteursByEntreprise(entreprise);
        return ResponseEntity.ok(tuteurs);
    }
    
    @GetMapping("/myprofile")
    public ResponseEntity<UserDTO> getProfile(@RequestHeader("Authorization") String token) {
        UserDTO userDto = adminService.getProfile(token);
        return ResponseEntity.ok(userDto);
    }
   

    // === Stagiaires ===

    @PostMapping("/stagiaires")
    public ResponseEntity<?> createStagiaire(@RequestBody User stagiaire) {
        try {
            User createdStagiaire = adminService.createUserWithRole(stagiaire, Role.STAGIAIRE);
            return ResponseEntity.ok(createdStagiaire);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }


    @PutMapping("/stagiaires/{id}")
    public ResponseEntity<?> updateStagiaire(@PathVariable Long id, @RequestBody User stagiaire) {
        try {
            User updatedStagiaire = adminService.updateUserWithRole(id, stagiaire, Role.STAGIAIRE);
            if (updatedStagiaire != null) {
                return ResponseEntity.ok(updatedStagiaire);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body(Collections.singletonMap("message", "Stagiaire non trouvé."));
            }
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(Collections.singletonMap("message", "Cet email est déjà utilisé."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Collections.singletonMap("message", "Erreur lors de la mise à jour : " + e.getMessage()));
        }
    }

    @DeleteMapping("/stagiaires/{id}")
    public ResponseEntity<?> deleteStagiaire(@PathVariable Long id) {
        try {
            adminService.deleteUserByIdAndRole(id, Role.STAGIAIRE);
            return ResponseEntity.noContent().build(); 
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Collections.singletonMap("message", "Stagiaire non trouvé.")); 
        }
    }


    @GetMapping("/stagiaires")
    public ResponseEntity<?> getAllStagiaires() {
        try {
            List<User> stagiaires = adminService.getUsersByRole(Role.STAGIAIRE);
            if (stagiaires.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); 
            }
            return ResponseEntity.ok(stagiaires);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.singletonMap("message", "Erreur lors de la récupération des stagiaires.")); // 500 Internal Server Error en cas d'exception
        }
    }

    @GetMapping("/stagiaires/{id}")
    public ResponseEntity<?> getStagiaireById(@PathVariable Long id) {
        try {
            User stagiaire = adminService.getUserByIdAndRole(id, Role.STAGIAIRE);
            return ResponseEntity.ok(stagiaire);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Collections.singletonMap("message", "Stagiaire non trouvé"));
        }
    }
    
    
    
    // =========================== Tuteurs ======================

    @PostMapping("/tuteurs")
    public ResponseEntity<?> createTuteur(@RequestBody User tuteur) {
        try {
            User createdTuteur = adminService.createUserWithRole(tuteur, Role.TUTEUR);
            return ResponseEntity.ok(createdTuteur);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }


    @PutMapping("/tuteurs/{id}")
    public ResponseEntity<?> updateTuteur(@PathVariable Long id, @RequestBody User tuteur) {
        try {
            User updatedTuteur = adminService.updateUserWithRole(id, tuteur, Role.TUTEUR);
            if (updatedTuteur != null) {
                return ResponseEntity.ok(updatedTuteur);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body(Collections.singletonMap("message", "Tuteur non trouvé."));
            }
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(Collections.singletonMap("message", "Cet email est déjà utilisé."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Collections.singletonMap("message", "Erreur lors de la mise à jour : " + e.getMessage()));
        }
    }

    @DeleteMapping("/tuteurs/{id}")
    public ResponseEntity<?> deleteTuteur(@PathVariable Long id) {
        try {
            adminService.deleteUserByIdAndRole(id, Role.TUTEUR);
            return ResponseEntity.noContent().build(); 
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Collections.singletonMap("message", "Tuteur non trouvé.")); 
        }
    }
    

    @GetMapping("/tuteurs")
    public ResponseEntity<?> getAllTuteurs() {
        try {
            List<User> tuteurs = adminService.getUsersByRole(Role.TUTEUR);
            if (tuteurs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); 
            }
            return ResponseEntity.ok(tuteurs); 
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.singletonMap("message", "Erreur lors de la récupération des tuteurs.")); // 500 Internal Server Error en cas d'exception
        }
    }

    @GetMapping("/tuteurs/{id}")
    public ResponseEntity<?> getTuteurById(@PathVariable Long id) {
        try {
            User tuteur = adminService.getUserByIdAndRole(id, Role.TUTEUR);
            return ResponseEntity.ok(tuteur);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Collections.singletonMap("message", "Tuteur non trouvé"));
        }
    }

    // ========================== Compétences =======================
   
    @PostMapping("/competences")
    public ResponseEntity<?> createCompetence(@RequestBody Competence competence) {
        try {
            Competence createdCompetence = adminService.createCompetence(competence);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCompetence); 
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            		.body(Collections.singletonMap("message", "Catégorie non valide"));
        }
    }

    @GetMapping("/competences")
    public ResponseEntity<Object> getAllCompetences() {
        try {
            List<Competence> competences = adminService.getAllCompetences();
            
            if (competences.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                                     .body(Collections.singletonMap("message", "Aucune compétence trouvée"));
            }
            return ResponseEntity.ok(competences);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.singletonMap("message", "Erreur lors de la récupération des compétences"));
        }
    }

    
    
    @GetMapping("/competences/{id}")
    public ResponseEntity<Object> getCompetenceById(@PathVariable Long id) {
        try {
            Competence competence = adminService.getCompetenceById(id);
            return ResponseEntity.ok(competence);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body("Compétence introuvable avec l'ID : " + id);
        }
    }
    
    @PutMapping("/competences/{id}")
    public ResponseEntity<Object> updateCompetence(@PathVariable Long id, @RequestBody Competence competence) {
        try {
            Competence updatedCompetence = adminService.updateCompetence(id, competence);
            return ResponseEntity.ok(updatedCompetence);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body("Compétence introuvable avec l'ID : " + id);
        }
    }
    

    @DeleteMapping("/competences/{id}")
    public ResponseEntity<Object> deleteCompetence(@PathVariable Long id) {
        try {
            adminService.deleteCompetence(id);
            return ResponseEntity.noContent().build(); // Retourne un status 204 sans contenu
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
            	    .body(Collections.singletonMap("message", "Compétence introuvable."));
        }
    }

 // ========================== Stages =======================

 // Ajouter un stage
    @PostMapping("/stages")
    public ResponseEntity<Stage> createStage(@RequestBody StageDTO stageDto) {
        Stage created = adminService.createStage(stageDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    
    // Récupérer tous les stages
    @GetMapping("/stages")
    public ResponseEntity<Object> getAllStages() {
        try {
            List<StageDTO> stages = adminService.getAllStages();
            return ResponseEntity.ok(stages);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                                 .body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.singletonMap("message", "Erreur lors de la récupération des stages."));
        }
    }

    // Récupérer un stage par ID
    @GetMapping("/stages/{id}")
    public ResponseEntity<Object> getStageById(@PathVariable Long id) {
        try {
        	StageDTO stage = adminService.getStageById(id);
            return ResponseEntity.ok(stage);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.singletonMap("message", "Erreur lors de la récupération du stage."));
        }
    }

    // Modifier un stage
    @PutMapping("/stages/{id}")
    public ResponseEntity<StageDTO> updateStage(@PathVariable Long id, @RequestBody StageDTO stageDto) {
    	StageDTO updated = adminService.updateStage(id, stageDto);
        return ResponseEntity.ok(updated);
    }

    
    // Supprimer un stage
    @DeleteMapping("/stages/{id}")
    public ResponseEntity<Object> deleteStage(@PathVariable Long id) {
        try {
            adminService.deleteStage(id);
            return ResponseEntity.noContent().build(); 
        } catch (RuntimeException e) {
        	return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Stage introuvable avec l'ID : " + id));
        }
    }

    
}







