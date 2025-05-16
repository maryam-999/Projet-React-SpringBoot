package com.example.service.Impl;

import com.example.dto.ReunionRequestDTO;
import com.example.model.Reunion;
import com.example.model.User;
import com.example.repository.ReunionRepository;
import com.example.repository.UserRepository;
import com.example.service.ReunionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReunionServiceImpl implements ReunionService {

    @Autowired
    private ReunionRepository reunionRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Reunion> getReunionsByUserId(Long userId) {
        return reunionRepository.findByUserId(userId);
    }

    @Override
    public Reunion addReunion(Long userId, ReunionRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Reunion reunion = new Reunion();
        reunion.setTitle(dto.getTitle());
        reunion.setStart(dto.getStart());
        reunion.setEnd(dto.getEnd());
        reunion.setDescription(dto.getDescription());
        reunion.setUser(user);

        return reunionRepository.save(reunion);
    }

    @Override
    public void deleteReunion(Long userId, Long reunionId) {
        Reunion reunion = reunionRepository.findByIdAndUserId(reunionId, userId)
                .orElseThrow(() -> new RuntimeException("Réunion non trouvée ou non autorisée"));
        reunionRepository.delete(reunion);
    }

    @Override
    public Reunion updateReunion(Long userId, Long reunionId, ReunionRequestDTO dto) {
        Reunion reunion = reunionRepository.findByIdAndUserId(reunionId, userId)
                .orElseThrow(() -> new RuntimeException("Réunion non trouvée ou non autorisée"));
        reunion.setTitle(dto.getTitle());
        reunion.setDescription(dto.getDescription());
        return reunionRepository.save(reunion);
    }
    
    @Override
    public List<Reunion> getUpcomingReunionsForUser(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        return reunionRepository.findByUserIdAndStartAfter(userId, now);
    }
    
    @Override
    public long countReunionsForUser(Long userId) {
        return reunionRepository.countByUserId(userId);
    }
    
    
    
}










