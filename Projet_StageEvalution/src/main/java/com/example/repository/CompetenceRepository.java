package com.example.repository;

import com.example.enumerations.CategorieCompetence;
import com.example.model.Competence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CompetenceRepository extends JpaRepository<Competence, Long> {
	List<Competence> findByCategorie(CategorieCompetence categorie);

}

