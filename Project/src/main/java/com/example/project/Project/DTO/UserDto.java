package com.example.project.Project.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UserDto {

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is mandatory")
    private String email;

    @NotBlank(message = "Password is mandatory")
    private String password;

    @NotBlank(message = "Role is mandatory")
    private String role;

    @NotBlank(message = "Full name is mandatory")
    private String fullname;

    public UserDto() {}

    public UserDto(String email, String password, String role, String fullname) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.fullname = fullname;
    }


    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; } // Fixed to String
    public void setRole(String role) { this.role = role; }
    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }
}