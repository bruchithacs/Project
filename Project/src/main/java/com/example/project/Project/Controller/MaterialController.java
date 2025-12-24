package com.example.project.Project.Controller;

import com.example.project.Project.Entity.Material;
import com.example.project.Project.Repository.MaterialRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MaterialController {

    private final MaterialRepository materialRepository;
    private final String uploadDir = "E:/Project/uploads/materials/";

    public MaterialController(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @PostMapping(value = "/add-material", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addMaterial(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            @RequestParam("semester") Integer semester
    ) {
        try {
            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Title is required");
            }
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is required");
            }
            if (semester == null || semester < 1 || semester > 6) {
                return ResponseEntity.badRequest().body("Semester must be between 1 and 8");
            }

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
            File destFile = new File(uploadDir + fileName);
            file.transferTo(destFile);

            Material material = new Material();
            material.setTitle(title);
            material.setFilePath("/materials/" + fileName);
            material.setSemester(semester);
            materialRepository.save(material);

            return ResponseEntity.ok(material);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload material: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/materials")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Material>> getAllMaterials() {
        try {
            List<Material> materials = materialRepository.findAll();
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/materials/semester/{semester}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<Material>> getMaterialsBySemester(@PathVariable Integer semester) {
        try {
            if (semester == null || semester < 1 || semester > 8) {
                return ResponseEntity.badRequest().body(null);
            }
            List<Material> materials = materialRepository.findBySemester(semester);
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/delete-material/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteMaterial(@PathVariable Long id) {
        try {
            Material material = materialRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Material not found"));
            Path filePath = Paths.get(uploadDir + material.getFilePath().substring("/materials/".length()));
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
            materialRepository.deleteById(id);
            return ResponseEntity.ok("Material deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete file: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Material not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    @PutMapping(value = "/update-material/{id}", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateMaterial(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("semester") Integer semester
    ) {
        try {
            Material material = materialRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Material not found"));
            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Title is required");
            }
            if (semester == null || semester < 1 || semester > 6) {
                return ResponseEntity.badRequest().body("Semester must be between 1 and 6");
            }

            material.setTitle(title);
            material.setSemester(semester);
            if (file != null && !file.isEmpty()) {
                Path oldFilePath = Paths.get(uploadDir + material.getFilePath().substring("/materials/".length()));
                if (Files.exists(oldFilePath)) {
                    Files.delete(oldFilePath);
                }
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
                File destFile = new File(uploadDir + fileName);
                file.transferTo(destFile);
                material.setFilePath("/materials/" + fileName);
            }
            materialRepository.save(material);
            return ResponseEntity.ok("Material updated successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update material: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Material not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }
}