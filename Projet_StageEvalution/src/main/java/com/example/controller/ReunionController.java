package com.example.controller;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.ReunionRequestDTO;
import com.example.model.Reunion;
import com.example.service.ReunionService;

@RestController
@RequestMapping("/api/reunions")
public class ReunionController {

	
	//accees par tous les users(tous les token)
	 @Autowired
	    private ReunionService reunionService;

	    @GetMapping("/{userId}")
	    public List<Reunion> getReunions(@PathVariable Long userId) {
	        return reunionService.getReunionsByUserId(userId);
	    }

	    @PostMapping("/{userId}")
	    public Reunion addReunion(@PathVariable Long userId, @RequestBody ReunionRequestDTO dto) {
	        return reunionService.addReunion(userId, dto);
	    }

	    @DeleteMapping("/{userId}/{reunionId}")
	    public ResponseEntity<?> deleteReunion(@PathVariable Long userId, @PathVariable Long reunionId) {
	        reunionService.deleteReunion(userId, reunionId);
	        return ResponseEntity.ok().build();
	    }

	    @PutMapping("/{userId}/{reunionId}")
	    public Reunion updateReunion(@PathVariable Long userId, @PathVariable Long reunionId,
	                                  @RequestBody ReunionRequestDTO dto) {
	        return reunionService.updateReunion(userId, reunionId, dto);
	    }
	    
	    
	    @GetMapping("/upcoming_reunions/{userId}")
	    public ResponseEntity<?> getUpcomingReunions(@PathVariable Long userId) {
	        try {
	            List<Reunion> upcomingReunions = reunionService.getUpcomingReunionsForUser(userId);
	            return new ResponseEntity<>(upcomingReunions, HttpStatus.OK);
	        } catch (Exception e) {
	            return new ResponseEntity<>("Erreur lors de la récupération des réunions à venir : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	    
	    
	    @GetMapping("/count_for_user/{userId}")
	    public ResponseEntity<?> countReunions(@PathVariable Long userId) {
	        try {
	            long count = reunionService.countReunionsForUser(userId);
	            return new ResponseEntity<>(count, HttpStatus.OK);
	        } catch (Exception e) {
	            return new ResponseEntity<>("Erreur lors du comptage des réunions : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	    
}
