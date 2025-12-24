package com.example.project.Project.Controller;

import com.example.project.Project.Entity.PhotoVideo;
import com.example.project.Project.Repository.PhotoVideoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api")
public class PhotoVideoController {

    private final PhotoVideoRepository photoVideoRepository;
    private final String uploadDir = "E:/Project/uploads/photos-videos/";

    public PhotoVideoController(PhotoVideoRepository photoVideoRepository) {
        this.photoVideoRepository = photoVideoRepository;
    }

    @PostMapping("/add-photo-video")
    public ResponseEntity<?> addPhotoVideo(
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file uploaded");
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                if (!dir.mkdirs()) {
                    throw new IOException("Failed to create directory: " + uploadDir);
                }
            }
            File destFile = new File(uploadDir + fileName);
            file.transferTo(destFile);
            if (!destFile.exists()) {
                throw new IOException("File not saved to: " + destFile.getAbsolutePath());
            }

            PhotoVideo photoVideo = new PhotoVideo();
            photoVideo.setType(type);
            photoVideo.setFilePath("/photos-videos/" + fileName);
            PhotoVideo saved = photoVideoRepository.save(photoVideo);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }

    @GetMapping("/photos-videos")
    public ResponseEntity<Iterable<PhotoVideo>> getAllPhotosVideos() {
        return ResponseEntity.ok(photoVideoRepository.findAll());
    }
}