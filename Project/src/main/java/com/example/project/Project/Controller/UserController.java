package com.example.project.Project.Controller;

import com.example.project.Project.DTO.*;
import com.example.project.Project.Entity.*;
import com.example.project.Project.Repository.*;
import com.example.project.Project.Service.AdminService;
import com.example.project.Project.Service.CustomUserDetail;
import com.example.project.Project.Service.CustomUserDetailsService;
import com.example.project.Project.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {
    private final String uploadDir = "uploads"; // Matches AdminService

    @Autowired
    private AdminService adminService;
    @Autowired
    private MaterialRepository materialRepository;
    @Autowired
    private FacultyRepository facultyRepository;
    @Autowired
    private PhotoVideoRepository photoVideoRepository;
    @Autowired
    private AnnouncementRepository announcementRepository;
    @Autowired
    private SyllabusRepository syllabusRepository;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            userService.save(userDto);
            return ResponseEntity.ok("User registered successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }



    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> loginUser(@RequestBody UserDto userDto) {
        try {
            if (userDto.getEmail() == null || userDto.getEmail().isBlank() ||
                    userDto.getPassword() == null || userDto.getPassword().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are mandatory");
            }
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            CustomUserDetail customUserDetail = (CustomUserDetail) userDetailsService.loadUserByUsername(userDto.getEmail());
            return ResponseEntity.ok(new LoginResponse(
                    customUserDetail.getUsername(),
                    customUserDetail.getAuthorities().iterator().next().getAuthority(),
                    customUserDetail.getFullname()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed: " + e.getMessage());
        }
    }

    @GetMapping("/student-dashboard")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<DashboardResponse> getStudentDashboard(Principal principal) {
        List<Material> materials = materialRepository.findAll();
        List<Announcement> announcements = announcementRepository.findAll();
        List<Faculty> faculty = facultyRepository.findAll();
        List<PhotoVideo> photosVideos = photoVideoRepository.findAll();
        List<Syllabus> syllabi = syllabusRepository.findAll();

        DashboardResponse dashboardResponse = new DashboardResponse(
                materials, announcements, faculty, photosVideos, syllabi
        );
        return ResponseEntity.ok(dashboardResponse);
    }
    @GetMapping("/admin-page")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getAdminPage(Principal principal) {
        return ResponseEntity.ok("Welcome to Admin Dashboard");
    }

    // Announcement Endpoints
    @GetMapping("/announcements")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Announcement>> getAnnouncements(Principal principal) {
        return ResponseEntity.ok(adminService.getAllAnnouncements());
    }

    @PostMapping("/add-announcement")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addAnnouncement(@RequestBody AnnouncementDto announcementDto) {
        try {
            if (announcementDto.getTitle() == null || announcementDto.getTitle().isBlank()) {
                return ResponseEntity.badRequest().body("Title is required");
            }
            adminService.addAnnouncement(announcementDto);
            return ResponseEntity.ok("Announcement added");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add announcement: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-announcement/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAnnouncement(@PathVariable Long id) {
        try {
            adminService.deleteAnnouncement(id);
            return ResponseEntity.ok("Announcement deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Announcement not found");
        }
    }

    @PutMapping("/update-announcement/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateAnnouncement(@PathVariable Long id, @RequestBody AnnouncementDto announcementDto) {
        try {
            if (announcementDto.getTitle() == null || announcementDto.getTitle().isBlank()) {
                return ResponseEntity.badRequest().body("Title is required");
            }
            adminService.updateAnnouncement(id, announcementDto);
            return ResponseEntity.ok("Announcement updated");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Announcement not found");
        }
    }

    // Photo/Video Endpoints
    @GetMapping("/user/photos-videos")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PhotoVideo>> getPhotosVideos(Principal principal) {
        return ResponseEntity.ok(adminService.getAllPhotosVideos());
    }

    @PostMapping(value = "/add-photo-video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addPhotoVideo(
            @RequestPart("type") String type,
            @RequestPart("file") MultipartFile file) {
        try {
            if (type == null || type.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Type is required");
            }
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is required");
            }
            PhotoVideoDto photoVideoDto = new PhotoVideoDto();
            photoVideoDto.setType(type);
            String filePath = adminService.saveFile(file, "photos-videos");
            photoVideoDto.setFilePath(filePath);
            adminService.addPhotoVideo(photoVideoDto);
            return ResponseEntity.ok("Photo/Video added");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-photo-video/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePhotoVideo(@PathVariable Long id) {
        try {
            adminService.deletePhotoVideo(id);
            return ResponseEntity.ok("Photo/Video deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Photo/Video not found");
        }
    }

    // Faculty Endpoints
    @GetMapping("/faculty")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Faculty>> getFaculty(Principal principal) {
        return ResponseEntity.ok(adminService.getAllFaculty());
    }

    @PostMapping(value = "/add-faculty", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addFaculty(
            @RequestPart("name") String name,
            @RequestPart("qualification") String qualification,
            @RequestPart("dateOfJoining") String dateOfJoining,
            @RequestPart("areaOfSpecialization") String areaOfSpecialization,
            @RequestPart("designation") String designation,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {
        try {
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            FacultyDto facultyDto = new FacultyDto();
            facultyDto.setName(name);
            facultyDto.setQualification(qualification);
            facultyDto.setDateOfJoining(java.time.LocalDate.parse(dateOfJoining));
            facultyDto.setAreaOfSpecialization(areaOfSpecialization);
            facultyDto.setDesignation(designation);
            if (photo != null && !photo.isEmpty()) {
                String filePath = adminService.saveFile(photo, "photos-videos");
                facultyDto.setPhotoPath(filePath);
            }
            adminService.addFaculty(facultyDto);
            return ResponseEntity.ok("Faculty added");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload photo: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid faculty data: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-faculty/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteFaculty(@PathVariable Long id) {
        try {
            adminService.deleteFaculty(id);
            return ResponseEntity.ok("Faculty deleted");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete faculty photo: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Faculty not found");
        }
    }

    @PutMapping(value = "/update-faculty/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateFaculty(
            @PathVariable Long id,
            @RequestPart("name") String name,
            @RequestPart("qualification") String qualification,
            @RequestPart("dateOfJoining") String dateOfJoining,
            @RequestPart("areaOfSpecialization") String areaOfSpecialization,
            @RequestPart("designation") String designation,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {
        try {
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            FacultyDto facultyDto = new FacultyDto();
            facultyDto.setName(name);
            facultyDto.setQualification(qualification);
            facultyDto.setDateOfJoining(java.time.LocalDate.parse(dateOfJoining));
            facultyDto.setAreaOfSpecialization(areaOfSpecialization);
            facultyDto.setDesignation(designation);
            if (photo != null && !photo.isEmpty()) {
                String filePath = adminService.saveFile(photo, "photos-videos");
                facultyDto.setPhotoPath(filePath);
            }
            adminService.updateFaculty(id, facultyDto);
            return ResponseEntity.ok("Faculty updated");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update faculty photo: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Faculty not found");
        }
    }

    // Syllabus Endpoints
    @GetMapping("/syllabus")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Syllabus>> getSyllabus(Principal principal) {
        return ResponseEntity.ok(adminService.getAllSyllabus());
    }

    @PostMapping(value = "/add-syllabus", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addSyllabus(
            @RequestPart("semester") String semester,
            @RequestPart("file") MultipartFile file) {
        try {
            if (semester == null || semester.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Semester is required");
            }
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is required");
            }
            SyllabusDto syllabusDto = new SyllabusDto();
            syllabusDto.setSemester(semester);
            String filePath = adminService.saveFile(file, "syllabus");
            syllabusDto.setFilePath(filePath);
            adminService.addSyllabus(syllabusDto);
            return ResponseEntity.ok("Syllabus added");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-syllabus/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSyllabus(@PathVariable Long id) {
        try {
            adminService.deleteSyllabus(id);
            return ResponseEntity.ok("Syllabus deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Syllabus not found");
        }
    }

    @PutMapping(value = "/update-syllabus/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateSyllabus(
            @PathVariable Long id,
            @RequestPart("semester") String semester,
            @RequestPart("file") MultipartFile file) {
        try {
            if (semester == null || semester.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Semester is required");
            }
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is required");
            }
            SyllabusDto syllabusDto = new SyllabusDto();
            syllabusDto.setSemester(semester);
            String filePath = adminService.saveFile(file, "syllabus");
            syllabusDto.setFilePath(filePath);
            adminService.updateSyllabus(id, syllabusDto);
            return ResponseEntity.ok("Syllabus updated");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Syllabus not found");
        }
    }

    @GetMapping("/files/{filename:.+}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                String contentType = "application/octet-stream";
                String fileNameLower = filename.toLowerCase();
                if (fileNameLower.endsWith(".png")) contentType = "image/png";
                else if (fileNameLower.endsWith(".jpg") || fileNameLower.endsWith(".jpeg")) contentType = "image/jpeg";
                else if (fileNameLower.endsWith(".gif")) contentType = "image/gif";
                else if (fileNameLower.endsWith(".webp")) contentType = "image/webp";
                else if (fileNameLower.endsWith(".avif")) contentType = "image/avif";
                else if (fileNameLower.endsWith(".pdf")) contentType = "application/pdf";

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}