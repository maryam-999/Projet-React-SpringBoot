package com.example.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.StatisticsAdminDTO;
import com.example.dto.StatisticsStagiaireDTO;
import com.example.dto.StatisticsTuteurDTO;
import com.example.model.Evaluation;
import com.example.model.Stage;
import com.example.model.User;
import com.example.repository.EvaluationRepository;
import com.example.repository.StageRepository;
import com.example.repository.UserRepository;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

	@Autowired
    private UserRepository userRepository;

    @Autowired
    private StageRepository stageRepository;
    
    @Autowired
    private EvaluationRepository evaluationRepository;

    @GetMapping("/admin-statistics")
    public StatisticsAdminDTO getStatistics() {
        List<User> users = userRepository.findAll();
        List<Stage> stages = stageRepository.findAll();

        long totalStagiaires = users.stream()
            .filter(u -> u.getRole().name().equals("STAGIAIRE"))
            .count();

        long totalTuteurs = users.stream()
            .filter(u -> u.getRole().name().equals("TUTEUR"))
            .count();

        long stagiairesEnCours = stages.stream()
            .filter(s -> s.getDateDebut().isBefore(LocalDate.now()) &&
                         s.getDateFin().isAfter(LocalDate.now()))
            .map(Stage::getStagiaire)
            .distinct()
            .count();

        Map<String, Long> repartitionRoles = users.stream()
            .collect(Collectors.groupingBy(u -> u.getRole().name(), Collectors.counting()));

        Map<String, Long> repartitionStagiairesParInstitution = users.stream()
            .filter(u -> u.getRole().name().equals("STAGIAIRE"))
            .collect(Collectors.groupingBy(User::getInstitution, Collectors.counting()));

        Map<String, Long> repartitionTuteursParEntreprise = users.stream()
            .filter(u -> u.getRole().name().equals("TUTEUR"))
            .collect(Collectors.groupingBy(User::getEntreprise, Collectors.counting()));

        StatisticsAdminDTO dto = new StatisticsAdminDTO();
        dto.setTotalStagiaires(totalStagiaires);
        dto.setTotalTuteurs(totalTuteurs);
        dto.setStagiairesEnCours(stagiairesEnCours);
        dto.setTotalStages(stages.size());
        dto.setRepartitionRoles(repartitionRoles);
        dto.setRepartitionStagiairesParInstitution(repartitionStagiairesParInstitution);
        dto.setRepartitionTuteursParEntreprise(repartitionTuteursParEntreprise);

        return dto;
    }
    
    
    @GetMapping("/stagiaire-statistics/{stagiaireId}")
    public StatisticsStagiaireDTO getStagiaireStatistics(@PathVariable Long stagiaireId) {
        List<Stage> stages = stageRepository.findByStagiaireId(stagiaireId);
        List<Long> stageIds = stages.stream().map(Stage::getId).toList();
        List<Evaluation> evaluations = evaluationRepository.findByStageIdIn(stageIds);

        LocalDate now = LocalDate.now();

        long totalStages = stages.size();
        long enCours = stages.stream().filter(s -> s.getDateDebut().isBefore(now) && s.getDateFin().isAfter(now)).count();
        long aVenir = stages.stream().filter(s -> s.getDateDebut().isAfter(now)).count();
        long nbEntreprises = stages.stream().map(Stage::getEntreprise).distinct().count();

        Map<String, Long> stagesParEntreprise = stages.stream()
            .collect(Collectors.groupingBy(Stage::getEntreprise, Collectors.counting()));

        Map<String, Long> stagesParTuteur = stages.stream()
            .filter(s -> s.getTuteur() != null)
            .collect(Collectors.groupingBy(
                s -> s.getTuteur().getNom() + " " + s.getTuteur().getPrenom(),
                Collectors.counting()
            ));

        long stagesEvalues = evaluations.size();
        long stagesNonEvalues = totalStages - stagesEvalues;

        StatisticsStagiaireDTO dto = new StatisticsStagiaireDTO();
        dto.setTotalStages(totalStages);
        dto.setStagesEnCours(enCours);
        dto.setStagesAVenir(aVenir);
        dto.setStagesEvalues(stagesEvalues);
        dto.setStagesNonEvalues(stagesNonEvalues);
        dto.setNbEntreprisesDifferentes(nbEntreprises);
        dto.setStagesParEntreprise(stagesParEntreprise);
        dto.setStagesParTuteur(stagesParTuteur);

        return dto;
    }
    
    
    
    @GetMapping("/tuteur-statistics/{tuteurId}")
    public StatisticsTuteurDTO getStatisticsTuteur(@PathVariable Long tuteurId) {
    User tuteur = userRepository.findById(tuteurId).orElse(null);
    if (tuteur == null || !tuteur.getRole().name().equals("TUTEUR")) {
    throw new IllegalArgumentException("Utilisateur non trouvé ou n'est pas un tuteur");
    }

    List<Stage> stages = stageRepository.findByTuteurId(tuteurId);
    List<Long> stageIds = stages.stream().map(Stage::getId).toList();
    List<Evaluation> evaluations = evaluationRepository.findByStageIdIn(stageIds);

    LocalDate now = LocalDate.now();

    long totalStages = stages.size();
    long enCours = stages.stream()
        .filter(s -> s.getDateDebut().isBefore(now) && s.getDateFin().isAfter(now)).count();

    long termines = stages.stream()
        .filter(s -> s.getDateFin().isBefore(now)).count();

    Map<String, Long> repartitionParInstitution = stages.stream()
        .filter(s -> s.getStagiaire() != null && s.getStagiaire().getInstitution() != null)
        .collect(Collectors.groupingBy(
            s -> s.getStagiaire().getInstitution(),
            Collectors.counting()
        ));

    long evaluationsEffectuees = evaluations.size();
    long evaluationsRestantes = totalStages - evaluationsEffectuees;

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-yyyy");

    Map<String, Long> stagesParMois = stages.stream()
        .filter(s -> s.getDateDebut() != null)
        .collect(Collectors.groupingBy(
            s -> formatter.format(s.getDateDebut()),
            Collectors.counting()
        ));

    StatisticsTuteurDTO dto = new StatisticsTuteurDTO();
    dto.setTotalStagesEncadres(totalStages);
    dto.setStagesEnCours(enCours);
    dto.setStagesTermines(termines);
    dto.setEvaluationsEffectuees(evaluationsEffectuees);
    dto.setEvaluationsRestantes(evaluationsRestantes);
    dto.setRepartitionParInstitution(repartitionParInstitution);
    dto.setStagesParMois(stagesParMois); 

    return dto;
    }

}
