package com.example.project.Project.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "faculty")
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String qualification;

    @Column(name = "date_of_joining", nullable = false)
    private LocalDate dateOfJoining;

    @Column(name = "area_of_specialization", nullable = false)
    private String areaOfSpecialization;

    @Column(nullable = false)
    private String designation;

    @Column
    private String photo; // Path to the uploaded photo (e.g., "/faculty/123_photo.jpg")

    // Constructors
    public Faculty() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public LocalDate getDateOfJoining() { return dateOfJoining; }
    public void setDateOfJoining(LocalDate dateOfJoining) { this.dateOfJoining = dateOfJoining; }

    public String getAreaOfSpecialization() { return areaOfSpecialization; }
    public void setAreaOfSpecialization(String areaOfSpecialization) { this.areaOfSpecialization = areaOfSpecialization; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
}