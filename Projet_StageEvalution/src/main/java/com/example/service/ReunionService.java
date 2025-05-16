package com.example.service;

import com.example.dto.ReunionRequestDTO;
import com.example.model.Reunion;

import java.util.List;

public interface ReunionService {
	    List<Reunion> getReunionsByUserId(Long userId);
	    Reunion addReunion(Long userId, ReunionRequestDTO dto);
	    void deleteReunion(Long userId, Long reunionId);
	    Reunion updateReunion(Long userId, Long reunionId, ReunionRequestDTO dto);
	    List<Reunion> getUpcomingReunionsForUser(Long userId);
	    long countReunionsForUser(Long userId);

}
