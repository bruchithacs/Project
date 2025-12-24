package com.example.project.Project.DTO;

import com.example.project.Project.Entity.*;
import java.util.List;

public class DashboardResponse {
    private List<Material> materials;
    private List<Announcement> announcements;
    private List<Faculty> faculty;
    private List<PhotoVideo> photosVideos;
    private List<Syllabus> syllabi;

    // Constructors
    public DashboardResponse() {}

    public DashboardResponse(List<Material> materials, List<Announcement> announcements,
                             List<Faculty> faculty, List<PhotoVideo> photosVideos,
                             List<Syllabus> syllabi) {
        this.materials = materials;
        this.announcements = announcements;
        this.faculty = faculty;
        this.photosVideos = photosVideos;
        this.syllabi = syllabi;
    }

    // Getters and Setters
    public List<Material> getMaterials() {
        return materials;
    }

    public void setMaterials(List<Material> materials) {
        this.materials = materials;
    }

    public List<Announcement> getAnnouncements() {
        return announcements;
    }

    public void setAnnouncements(List<Announcement> announcements) {
        this.announcements = announcements;
    }

    public List<Faculty> getFaculty() {
        return faculty;
    }

    public void setFaculty(List<Faculty> faculty) {
        this.faculty = faculty;
    }

    public List<PhotoVideo> getPhotosVideos() {
        return photosVideos;
    }

    public void setPhotosVideos(List<PhotoVideo> photosVideos) {
        this.photosVideos = photosVideos;
    }

    public List<Syllabus> getSyllabi() {
        return syllabi;
    }

    public void setSyllabi(List<Syllabus> syllabi) {
        this.syllabi = syllabi;
    }
}