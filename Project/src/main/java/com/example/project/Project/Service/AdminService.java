package com.example.project.Project.Service;

import com.example.project.Project.Repository.*;
import com.example.project.Project.Entity.*;
import com.example.project.Project.DTO.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class AdminService {

    private final AnnouncementRepository announcementRepository;
    private final MaterialRepository materialRepository;
    private final PhotoVideoRepository photoVideoRepository;
    private final FacultyRepository facultyRepository;
    private final SyllabusRepository syllabusRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public AdminService(AnnouncementRepository announcementRepository, MaterialRepository materialRepository,
                        PhotoVideoRepository photoVideoRepository, FacultyRepository facultyRepository,
                        SyllabusRepository syllabusRepository) {
        this.announcementRepository = announcementRepository;
        this.materialRepository = materialRepository;
        this.photoVideoRepository = photoVideoRepository;
        this.facultyRepository = facultyRepository;
        this.syllabusRepository = syllabusRepository;
    }

    // File Handling Methods
    public String saveFile(MultipartFile file, String subDir) throws IOException {
        Path uploadPath = Paths.get(uploadDir, subDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        return "/" + subDir + "/" + fileName;
    }

    private void deleteFile(String filePath) throws IOException {
        if (filePath != null && !filePath.isBlank()) {
            Path path = Paths.get(uploadDir + filePath);
            if (Files.exists(path)) {
                Files.delete(path);
            }
        }
    }

    // Announcements
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public void addAnnouncement(AnnouncementDto dto) {
        Announcement announcement = new Announcement();
        announcement.setTitle(dto.getTitle());
        announcement.setContent(dto.getContent());
        announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }

    public void updateAnnouncement(Long id, AnnouncementDto dto) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        announcement.setTitle(dto.getTitle());
        announcement.setContent(dto.getContent());
        announcementRepository.save(announcement);
    }

    // Materials (Updated with Semester)
    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    public void addMaterial(MaterialDto dto) throws IOException {
        Material material = new Material();
        material.setTitle(dto.getTitle());
        material.setSemester(dto.getSemester()); // Assuming MaterialDto has semester
        String filePath = saveFile(dto.getFile(), "materials");
        material.setFilePath(filePath);
        materialRepository.save(material);
    }

    public void deleteMaterial(Long id) throws IOException {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        deleteFile(material.getFilePath());
        materialRepository.deleteById(id);
    }

    public void updateMaterial(Long id, MaterialDto dto) throws IOException {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        material.setTitle(dto.getTitle());
        material.setSemester(dto.getSemester()); // Assuming MaterialDto has semester
        if (dto.getFile() != null && !dto.getFile().isEmpty()) {
            deleteFile(material.getFilePath());
            String newFilePath = saveFile(dto.getFile(), "materials");
            material.setFilePath(newFilePath);
        }
        materialRepository.save(material);
    }

    // Photos and Videos
    public List<PhotoVideo> getAllPhotosVideos() {
        return photoVideoRepository.findAll();
    }

    public void addPhotoVideo(PhotoVideoDto dto) {
        PhotoVideo photoVideo = new PhotoVideo();
        photoVideo.setType(dto.getType());
        photoVideo.setFilePath(dto.getFilePath());
        photoVideoRepository.save(photoVideo);
    }

    public void deletePhotoVideo(Long id) {
        PhotoVideo photoVideo = photoVideoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Photo/Video not found"));
        try {
            deleteFile(photoVideo.getFilePath());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete photo/video file", e);
        }
        photoVideoRepository.deleteById(id);
    }

    // Faculty
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public void addFaculty(FacultyDto dto) throws IOException {
        Faculty faculty = new Faculty();
        faculty.setName(dto.getName());
        faculty.setQualification(dto.getQualification());
        faculty.setDateOfJoining(dto.getDateOfJoining());
        faculty.setAreaOfSpecialization(dto.getAreaOfSpecialization());
        faculty.setDesignation(dto.getDesignation());
        faculty.setPhoto(dto.getPhotoPath());
        facultyRepository.save(faculty);
    }

    public void deleteFaculty(Long id) throws IOException {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        if (faculty.getPhoto() != null) {
            deleteFile(faculty.getPhoto());
        }
        facultyRepository.deleteById(id);
    }

    public void updateFaculty(Long id, FacultyDto dto) throws IOException {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        faculty.setName(dto.getName());
        faculty.setQualification(dto.getQualification());
        faculty.setDateOfJoining(dto.getDateOfJoining());
        faculty.setAreaOfSpecialization(dto.getAreaOfSpecialization());
        faculty.setDesignation(dto.getDesignation());
        if (dto.getPhotoPath() != null) {
            if (faculty.getPhoto() != null) {
                deleteFile(faculty.getPhoto());
            }
            faculty.setPhoto(dto.getPhotoPath());
        }
        facultyRepository.save(faculty);
    }

    // Syllabus
    public List<Syllabus> getAllSyllabus() {
        return syllabusRepository.findAll();
    }

    public void addSyllabus(SyllabusDto dto) {
        Syllabus syllabus = new Syllabus();
        syllabus.setSemester(dto.getSemester());
        syllabus.setFilePath(dto.getFilePath());
        syllabusRepository.save(syllabus);
    }

    public void deleteSyllabus(Long id) {
        Syllabus syllabus = syllabusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Syllabus not found"));
        try {
            deleteFile(syllabus.getFilePath());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete syllabus file", e);
        }
        syllabusRepository.deleteById(id);
    }

    public void updateSyllabus(Long id, SyllabusDto dto) {
        Syllabus syllabus = syllabusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Syllabus not found"));
        syllabus.setSemester(dto.getSemester());
        syllabus.setFilePath(dto.getFilePath());
        syllabusRepository.save(syllabus);
    }
}