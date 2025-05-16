package com.example.service.Impl;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.dto.StageDTO;
import com.example.dto.UserDTO;
import com.example.enumerations.CategorieCompetence;
import com.example.enumerations.Role;
import com.example.model.Competence;
import com.example.model.Stage;
import com.example.model.User;
import com.example.repository.AuthRepository;
import com.example.repository.CompetenceRepository;
import com.example.repository.StageRepository;
import com.example.repository.UserRepository;
import com.example.security.jwt.JwtUtil;
import com.example.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	 
    @Autowired
    private AuthRepository authRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private CompetenceRepository competenceRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public String register(UserDTO userDto) {
        Optional<User> existingUser = authRepository.findByEmail(userDto.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email already in use.");
        }

        User user = new User();
        user.setNom(userDto.getNom());
        user.setPrenom(userDto.getPrenom());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(userDto.getRole());
        user.setEntreprise(userDto.getEntreprise());
        user.setInstitution(userDto.getInstitution());
        authRepository.save(user);

        return "User registered successfully!";
    }
    
    @Override
    public List<User> getTuteursByEntreprise(String entreprise) {
        return userRepository.findByRoleAndEntreprise(Role.TUTEUR, entreprise);
    }
   
    @Override
    public UserDTO getProfile(String token) {
        String jwtToken = token.substring(7); // Retirer "Bearer "
        String email = jwtUtil.extractEmail(jwtToken); // Extraire email

        User user = authRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDTO(
            user.getId(),
            user.getNom(),
            user.getPrenom(),
            user.getEmail(),
            user.getPassword(),
            user.getEntreprise(),
            user.getInstitution(),
            user.getRole()
        );
    }

  //users
    @Override
    public User createUserWithRole(User user, Role role) {
        // Vérification de l'existence de l'email dans la base de données
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("L'adresse e-mail est déjà utilisée.");
        }
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    
    @Override
    public User updateUserWithRole(Long id, User updatedUser, Role role) {
        User user = getUserByIdAndRole(id, role);
        if (user != null) {
            user.setNom(updatedUser.getNom());
            user.setEmail(updatedUser.getEmail());
            user.setPrenom(updatedUser.getPrenom());
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            user.setRole(updatedUser.getRole());
            user.setInstitution(updatedUser.getInstitution());
            user.setEntreprise(updatedUser.getEntreprise());
            return userRepository.save(user);
        }
        return null;
    }

    @Override
    public void deleteUserByIdAndRole(Long id, Role role) {
        User user = getUserByIdAndRole(id, role);
        if (user != null) {
            userRepository.delete(user);
        } else {
            throw new RuntimeException("Utilisateur non trouvé");
        }
    }


    
    @Override
    public List<User> getUsersByRole(Role role) {
        List<User> users = userRepository.findByRole(role);
        
        if (users.isEmpty()) {
            throw new RuntimeException("Aucun utilisateur trouvé pour le rôle : " + role);
        }
        return users;
    }
    

    @Override
    public User getUserByIdAndRole(Long id, Role role) {
        return userRepository.findByIdAndRole(id, role)
                .orElseThrow(() -> new RuntimeException("User not found or role mismatch"));
    }
    
    
    //==========================competences===================
    @Override
    public Competence createCompetence(Competence competence) {
        if (competence == null || competence.getCategorie() == null) {
            throw new IllegalArgumentException("La catégorie de la compétence est invalide : null");
        }

        // Convertir la catégorie en majuscules pour éviter les problèmes de casse
        String categorie = competence.getCategorie().name().toUpperCase();

        // Vérifier si la catégorie existe dans l'énumération
        if (Arrays.stream(CategorieCompetence.values())
                .noneMatch(c -> c.name().equals(categorie))) {
            throw new IllegalArgumentException("La catégorie de la compétence est invalide : " + competence.getCategorie());
        }

        return competenceRepository.save(competence);
    }

    
    
    @Override
    public List<Competence> getAllCompetences() {
        List<Competence> competences = competenceRepository.findAll();
        if (competences.isEmpty()) {
            throw new RuntimeException("Aucune compétence trouvée");
        }
        return competences;
    }


    @Override
    public Competence getCompetenceById(Long id) {
        return competenceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Compétence introuvable"));
    }
    
    @Override
    public Competence updateCompetence(Long id, Competence competence) {
        if (competence == null || competence.getCategorie() == null) {
            throw new IllegalArgumentException("La catégorie de la compétence est invalide : null");
        }

        String categorie = competence.getCategorie().name().toUpperCase();

        boolean categorieExistante = Arrays.stream(CategorieCompetence.values())
                                           .anyMatch(c -> c.name().equals(categorie));

        if (!categorieExistante) {
            throw new IllegalArgumentException(
                "La catégorie de la compétence est invalide : " + competence.getCategorie());
        }

        Competence existing = competenceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Compétence introuvable"));

        existing.setIntitule(competence.getIntitule());
        existing.setCategorie(competence.getCategorie());

        return competenceRepository.save(existing);
   }

     
    @Override
    public void deleteCompetence(Long id) {
        if (!competenceRepository.existsById(id)) {
            throw new RuntimeException("Compétence introuvable");
        }
        competenceRepository.deleteById(id);
    }
    
    
    //=====================stages=======================
    @Override
    public Stage createStage(StageDTO stageDto) {
        if (stageDto.getDateDebut().isAfter(stageDto.getDateFin())) {
            throw new IllegalArgumentException("La date de début ne peut pas être postérieure à la date de fin.");
        }

        User tuteur = userRepository.findByIdAndRole(stageDto.getTuteurId(), Role.TUTEUR)
            .orElseThrow(() -> new RuntimeException("Tuteur introuvable avec l'ID fourni."));
        User stagiaire = userRepository.findByIdAndRole(stageDto.getStagiaireId(), Role.STAGIAIRE)
            .orElseThrow(() -> new RuntimeException("Stagiaire introuvable avec l'ID fourni."));

        Stage stage = new Stage();
        stage.setTheme(stageDto.getTheme());
        stage.setObjectif(stageDto.getObjectif());
        stage.setEntreprise(stageDto.getEntreprise());
        stage.setDateDebut(stageDto.getDateDebut());
        stage.setDateFin(stageDto.getDateFin());
        stage.setTuteur(tuteur);
        stage.setStagiaire(stagiaire);

        return stageRepository.save(stage);
    }

    @Override
    public List<StageDTO> getAllStages() {
        List<Stage> stages = stageRepository.findAll();
        if (stages.isEmpty()) {
            throw new RuntimeException("Aucun stage trouvé.");
        }

        return stages.stream()
                .map(stage -> new StageDTO(
                    stage.getId(),
                    stage.getTheme(),
                    stage.getObjectif(),
                    stage.getEntreprise(),
                    stage.getDateDebut(),
                    stage.getDateFin(),
                    stage.getStagiaire(),
                    stage.getTuteur()
                ))
                .collect(Collectors.toList());
    }

    

    @Override
    public StageDTO getStageById(Long id) {
        Stage stage = stageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stage non trouvé"));

        return new StageDTO(
            stage.getId(),
            stage.getTheme(),
            stage.getObjectif(),
            stage.getEntreprise(),
            stage.getDateDebut(),
            stage.getDateFin(),
            stage.getStagiaire(),
            stage.getTuteur()
        );
    }


    @Override
    public StageDTO updateStage(Long id, StageDTO stageDto) {
        Stage existing = stageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stage non trouvé"));

        if (stageDto.getDateDebut().isAfter(stageDto.getDateFin())) {
            throw new IllegalArgumentException("La date de début ne peut pas être postérieure à la date de fin.");
        }

        User tuteur = userRepository.findByIdAndRole(stageDto.getTuteurId(), Role.TUTEUR)
                .orElseThrow(() -> new RuntimeException("Tuteur introuvable avec l'ID fourni."));
        User stagiaire = userRepository.findByIdAndRole(stageDto.getStagiaireId(), Role.STAGIAIRE)
                .orElseThrow(() -> new RuntimeException("Stagiaire introuvable avec l'ID fourni."));

        existing.setTheme(stageDto.getTheme());
        existing.setObjectif(stageDto.getObjectif());
        existing.setEntreprise(stageDto.getEntreprise());
        existing.setDateDebut(stageDto.getDateDebut());
        existing.setDateFin(stageDto.getDateFin());
        existing.setTuteur(tuteur);
        existing.setStagiaire(stagiaire);

        Stage updatedStage = stageRepository.save(existing);

        return new StageDTO(
            updatedStage.getId(),
            updatedStage.getTheme(),
            updatedStage.getObjectif(),
            updatedStage.getEntreprise(),
            updatedStage.getDateDebut(),
            updatedStage.getDateFin(),
            updatedStage.getStagiaire().getId(),
            updatedStage.getTuteur().getId()
        );
    }


    @Override
    public void deleteStage(Long id) {
        Stage stage = stageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Le stage avec l'ID " + id + " n'existe pas."));
        stageRepository.delete(stage);
    }
    

}









