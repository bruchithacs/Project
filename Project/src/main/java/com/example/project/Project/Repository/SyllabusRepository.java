package com.example.project.Project.Repository;

import com.example.project.Project.Entity.Syllabus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SyllabusRepository extends JpaRepository<Syllabus,Long> {
}
