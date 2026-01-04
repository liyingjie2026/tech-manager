package com.research.project.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.entity.Assessment;
import com.research.project.entity.AssessmentMaterial;
import com.research.project.dto.AssessmentStatisticsDTO;

public interface AssessmentService {
    Page<Assessment> getAssessmentPage(int current, int size, String year, String quarter, String status);
    Assessment getById(Long id);
    void createAssessment(Assessment assessment);
    void updateAssessment(Assessment assessment);
    
    Page<AssessmentMaterial> getMaterialPage(int current, int size, String year, String type);
    AssessmentMaterial getMaterialById(Long id);
    void uploadMaterial(AssessmentMaterial material);
    void deleteMaterial(Long id);
    
    AssessmentStatisticsDTO getStatistics(String year, String quarter);
}
