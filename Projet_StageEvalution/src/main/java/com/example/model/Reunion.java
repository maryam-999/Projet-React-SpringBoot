package com.example.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Reunion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime start;
    private LocalDateTime end;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference(value = "user-reunions")
    private User user;

    public Reunion() {}

    public Reunion(String title, String description, LocalDateTime start, LocalDateTime end, User user) {
        this.title = title;
        this.description = description;
        this.start = start;
        this.end = end;
        this.user = user;
    }

    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getStart() { return start; }
    public void setStart(LocalDateTime start) { this.start = start; }

    public LocalDateTime getEnd() { return end; }
    public void setEnd(LocalDateTime end) { this.end = end; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
