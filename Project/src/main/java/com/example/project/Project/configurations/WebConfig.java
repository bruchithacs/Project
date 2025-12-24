package com.example.project.Project.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/api/files/materials/**")
                .addResourceLocations("file:E:/Project/uploads/materials/");
        registry.addResourceHandler("/api/files/photos-videos/**") // Updated to plural
                .addResourceLocations("file:E:/Project/uploads/photos-videos/");
        registry.addResourceHandler("/api/files/syllabus/**")
                .addResourceLocations("file:E:/Project/uploads/syllabus/");
    }
}