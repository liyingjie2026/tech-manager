package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.entity.Assessment;
import com.research.project.entity.AssessmentMaterial;
import com.research.project.mapper.AssessmentMapper;
import com.research.project.mapper.AssessmentMaterialMapper;
import com.research.project.service.AssessmentService;
import com.research.project.dto.AssessmentStatisticsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AssessmentServiceImpl implements AssessmentService {
    
    @Autowired
    private AssessmentMapper assessmentMapper;
    
    @Autowired
    private AssessmentMaterialMapper materialMapper;
    
    @Override
    public Page<Assessment> getAssessmentPage(int current, int size, String year, String quarter, String status) {
        Page<Assessment> page = new Page<>(current, size);
        QueryWrapper<Assessment> wrapper = new QueryWrapper<>();
        wrapper.eq("deleted", 0);
        if (year != null && !year.isEmpty()) {
            wrapper.eq("year", year);
        }
        if (quarter != null && !quarter.isEmpty()) {
            wrapper.eq("quarter", quarter);
        }
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
        }
        wrapper.orderByDesc("create_time");
        return assessmentMapper.selectPage(page, wrapper);
    }
    
    @Override
    public Assessment getById(Long id) {
        return assessmentMapper.selectById(id);
    }
    
    @Override
    public void createAssessment(Assessment assessment) {
        assessmentMapper.insert(assessment);
    }
    
    @Override
    public void updateAssessment(Assessment assessment) {
        assessmentMapper.updateById(assessment);
    }
    
    @Override
    public Page<AssessmentMaterial> getMaterialPage(int current, int size, String year, String type) {
        Page<AssessmentMaterial> page = new Page<>(current, size);
        QueryWrapper<AssessmentMaterial> wrapper = new QueryWrapper<>();
        wrapper.eq("deleted", 0);
        if (year != null && !year.isEmpty()) {
            wrapper.eq("year", year);
        }
        if (type != null && !type.isEmpty()) {
            wrapper.eq("type", type);
        }
        wrapper.orderByDesc("create_time");
        return materialMapper.selectPage(page, wrapper);
    }
    
    @Override
    public AssessmentMaterial getMaterialById(Long id) {
        return materialMapper.selectById(id);
    }
    
    @Override
    public void uploadMaterial(AssessmentMaterial material) {
        materialMapper.insert(material);
    }
    
    @Override
    public void deleteMaterial(Long id) {
        AssessmentMaterial material = new AssessmentMaterial();
        material.setId(id);
        material.setDeleted(1);
        materialMapper.updateById(material);
    }
    
    @Override
    public AssessmentStatisticsDTO getStatistics(String year, String quarter) {
        AssessmentStatisticsDTO dto = new AssessmentStatisticsDTO();
        
        QueryWrapper<Assessment> wrapper = new QueryWrapper<>();
        wrapper.eq("deleted", 0);
        if (year != null && !year.isEmpty()) {
            wrapper.eq("year", year);
        }
        if (quarter != null && !quarter.isEmpty()) {
            wrapper.eq("quarter", quarter);
        }
        
        List<Assessment> assessments = assessmentMapper.selectList(wrapper);
        
        // Total count
        dto.setTotalCount(assessments.size());
        
        // Calculate average score
        if (!assessments.isEmpty()) {
            BigDecimal totalScore = BigDecimal.ZERO;
            int excellentCount = 0;
            
            for (Assessment assessment : assessments) {
                if (assessment.getScore() != null) {
                    totalScore = totalScore.add(BigDecimal.valueOf(assessment.getScore()));
                }
                
                // Count excellent (score >= 90 or rank = "优秀")
                if ((assessment.getScore() != null && assessment.getScore() >= 90) || 
                    ("优秀".equals(assessment.getRank()))) {
                    excellentCount++;
                }
            }
            
            dto.setAverageScore(totalScore.divide(BigDecimal.valueOf(assessments.size()), 2, BigDecimal.ROUND_HALF_UP));
            dto.setExcellentCount(excellentCount);
        } else {
            dto.setAverageScore(BigDecimal.ZERO);
            dto.setExcellentCount(0);
        }
        
        // Count pending materials (status = "待上传")
        QueryWrapper<AssessmentMaterial> materialWrapper = new QueryWrapper<>();
        materialWrapper.eq("deleted", 0);
        materialWrapper.eq("status", "待上传");
        if (year != null && !year.isEmpty()) {
            materialWrapper.eq("year", year);
        }
        Long pendingCount = materialMapper.selectCount(materialWrapper);
        dto.setPendingMaterialCount(pendingCount.intValue());
        
        return dto;
    }
}
