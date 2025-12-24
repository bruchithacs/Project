package com.example.project.Project.DTO;

import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public class FacultyDto {
    private String name;
    private String qualification;
    private LocalDate dateOfJoining;
    private String areaOfSpecialization;
    private String designation;
    private MultipartFile photo;
    private String photoPath; // New field

    // Getters and setters
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
    public MultipartFile getPhoto() { return photo; }
    public void setPhoto(MultipartFile photo) { this.photo = photo; }
    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }
}