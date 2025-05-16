package com.example.service;

import java.util.List;

import com.example.dto.StageDTO;
import com.example.dto.UserDTO;
import com.example.enumerations.Role;
import com.example.model.Competence;
import com.example.model.Stage;
import com.example.model.User;

public interface AdminService {
	
    String register(UserDTO userDto);
    UserDTO getProfile(String token);
    
    //gestion users (tuteur,stagiaire)
    List<User> getTuteursByEntreprise(String entreprise);
    User createUserWithRole(User user, Role role);
    User updateUserWithRole(Long id, User user, Role role);
    void deleteUserByIdAndRole(Long id, Role role);
    List<User> getUsersByRole(Role role);
    User getUserByIdAndRole(Long id, Role role);
    
    
    //gestion competences
    Competence createCompetence(Competence competence);
    List<Competence> getAllCompetences();
    Competence getCompetenceById(Long id);
    Competence updateCompetence(Long id, Competence competence);
    void deleteCompetence(Long id);
    
 // Gestion des stages
    Stage createStage(StageDTO stageDto);
    List<StageDTO> getAllStages();
    StageDTO getStageById(Long id);
    StageDTO updateStage(Long id, StageDTO stageDto);
    void deleteStage(Long id);
    
    
}
