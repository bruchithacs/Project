package com.example.project.Project.Controller;






import com.example.project.Project.Entity.Syllabus;
import com.example.project.Project.Repository.SyllabusRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api")
public class SyllabusController {

    private final SyllabusRepository syllabusRepository;

    public SyllabusController(SyllabusRepository syllabusRepository) {
        this.syllabusRepository = syllabusRepository;
    }

    @PostMapping("/add-syllabus")
    public ResponseEntity<Syllabus> addSyllabus(
            @RequestParam("semester") String semester,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String uploadDir = "E:/Project/uploads/syllabus/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        File destFile = new File(uploadDir + fileName);
        file.transferTo(destFile);

        Syllabus syllabus = new Syllabus();
        syllabus.setSemester(semester);
        syllabus.setFilePath("/syllabus/" + fileName);
        syllabusRepository.save(syllabus);
        return ResponseEntity.ok(syllabus);
    }
}