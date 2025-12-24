package com.example.project.Project.DTO;

public class LoginResponse {
    private String email;
    private String role;
    private String fullname;

    public LoginResponse(String email, String role, String fullname) {
        this.email = email;
        this.role = role;
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getFullname() {
        return fullname;
    }
}