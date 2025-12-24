package com.example.project.Project.Repository;

import com.example.project.Project.Entity.PhotoVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoVideoRepository extends JpaRepository<PhotoVideo,Long> {
}
