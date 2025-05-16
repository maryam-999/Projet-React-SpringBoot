package com.example;

import com.example.enumerations.CategorieCompetence;
import com.example.model.Competence;
import com.example.repository.CompetenceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CompetenceRepository competenceRepository;

    public DataInitializer(CompetenceRepository competenceRepository) {
        this.competenceRepository = competenceRepository;
    }

    @Override
    public void run(String... args) {
        List<Competence> competences = competenceRepository.findAll();
        
        if (competences.isEmpty()) {
            // INDIVIDU
            competenceRepository.save(new Competence("Être capable d'analyse et de synthèse", CategorieCompetence.INDIVIDU));
            competenceRepository.save(new Competence("Être capable de proposer des méthodes et des axes de travail", CategorieCompetence.INDIVIDU));
            competenceRepository.save(new Competence("Être capable de faire adhérer les acteurs", CategorieCompetence.INDIVIDU));
            competenceRepository.save(new Competence("Être capable de s'autoévaluer", CategorieCompetence.INDIVIDU));
            competenceRepository.save(new Competence("Être capable d'identifier des problèmes complexes", CategorieCompetence.INDIVIDU));

            // ENTREPRISE
            competenceRepository.save(new Competence("Être capable d'analyser le fonctionnement de l'entreprise d'accueil", CategorieCompetence.ENTREPRISE));
            competenceRepository.save(new Competence("Être capable d'identifier la réglementation, hiérarchie, droit du travail, RSE, CHSCT, CE, etc.", CategorieCompetence.ENTREPRISE));
            competenceRepository.save(new Competence("Être capable d'analyser la démarche projet, et d'organiser et de structurer un projet", CategorieCompetence.ENTREPRISE));
            competenceRepository.save(new Competence("Être capable d'apprendre à déceler et à comprendre la politique environnementale de l'entreprise", CategorieCompetence.ENTREPRISE));
            competenceRepository.save(new Competence("Être capable de rechercher, de sélectionner l'information nécessaire à ses activités", CategorieCompetence.ENTREPRISE));

            // SCIENTIFIQUE
            competenceRepository.save(new Competence("Être capable d'assurer la conception préliminaire de produits / services / processus / usages", CategorieCompetence.SCIENTIFIQUE));

            System.out.println("Compétences initialisées en base !");
        } else {
            System.out.println("La base de données contient déjà des compétences. Aucune initialisation nécessaire.");
        }
    }
}