package com.example.project.Project.DTO;



public class PhotoVideoDto {
    private String type; // "PHOTO" or "VIDEO"
    private String filePath;

    // Getters and setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
}
