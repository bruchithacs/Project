package com.example.project.Project.DTO;

import org.springframework.web.multipart.MultipartFile;

public class MaterialDto {
    private String title;
    private MultipartFile file;
    private Integer semester; // Added for semester support

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public MultipartFile getFile() { return file; }
    public void setFile(MultipartFile file) { this.file = file; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
}