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

import com.example.dto.StageEvaluationResponseDTO;
import com.example.dto.UserDTO;
import com.example.enumerations.Role;
import com.example.model.Reunion;
import com.example.service.ReunionService;
import com.example.service.StagiaireTuteurService;


@RestController
@RequestMapping("/api/stagiaire")
public class StagiaireController {

        @Autowired
        private StagiaireTuteurService stagiaireTuteurService;

        
        
        @GetMapping("/myprofile")
        public ResponseEntity<UserDTO> getProfile(@RequestHeader("Authorization") String token) {
            UserDTO userDto = stagiaireTuteurService.getProfile(token);
            return ResponseEntity.ok(userDto);
        }

        @GetMapping("/stages-evaluation/{stagiaireId}")
        public ResponseEntity<?> getStagesForStagiaire(@PathVariable Long stagiaireId) {
            try {
                List<StageEvaluationResponseDTO> result = stagiaireTuteurService
                        .getStagesWithEvaluationsByUserIdAndRole(stagiaireId, Role.STAGIAIRE);
                return ResponseEntity.ok(result);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("message", e.getMessage()));
            }
        }

      
 
   	

}
