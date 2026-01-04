package com.research.project.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.common.Result;
import com.research.project.dto.AssessmentStatisticsDTO;
import com.research.project.entity.Assessment;
import com.research.project.entity.AssessmentMaterial;
import com.research.project.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/assessment")
public class AssessmentController {
    
    @Autowired
    private AssessmentService assessmentService;
    
    @GetMapping("/list")
    public Result<Page<Assessment>> getAssessmentList(
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String quarter,
            @RequestParam(required = false) String status) {
        Page<Assessment> page = assessmentService.getAssessmentPage(current, size, year, quarter, status);
        return Result.success(page);
    }
    
    @GetMapping("/{id}")
    public Result<Assessment> getById(@PathVariable Long id) {
        Assessment assessment = assessmentService.getById(id);
        return Result.success(assessment);
    }
    
    @PostMapping
    public Result<Void> create(@RequestBody Assessment assessment) {
        assessmentService.createAssessment(assessment);
        return Result.success();
    }
    
    @PutMapping
    public Result<Void> update(@RequestBody Assessment assessment) {
        assessmentService.updateAssessment(assessment);
        return Result.success();
    }
    
    @GetMapping("/material/list")
    public Result<Page<AssessmentMaterial>> getMaterialList(
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String type) {
        Page<AssessmentMaterial> page = assessmentService.getMaterialPage(current, size, year, type);
        return Result.success(page);
    }
    
    @PostMapping("/material")
    public Result<Void> uploadMaterial(@RequestBody AssessmentMaterial material) {
        assessmentService.uploadMaterial(material);
        return Result.success();
    }
    
    @DeleteMapping("/material/{id}")
    public Result<Void> deleteMaterial(@PathVariable Long id) {
        assessmentService.deleteMaterial(id);
        return Result.success();
    }
    
    /**
     * 获取考核统计数据
     * 按钮：考核评价页面 - 加载汇总数据
     */
    @GetMapping("/statistics")
    public Result<AssessmentStatisticsDTO> getStatistics(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String quarter) {
        AssessmentStatisticsDTO statistics = assessmentService.getStatistics(year, quarter);
        return Result.success(statistics);
    }
}
