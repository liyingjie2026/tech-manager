package com.research.project.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.common.PageResult;
import com.research.project.common.Result;
import com.research.project.dto.TransformationDTO;
import com.research.project.dto.TransformationCreateDTO;
import com.research.project.dto.TransformationUpdateDTO;
import com.research.project.entity.Transformation;
import com.research.project.service.TransformationService;
import com.research.project.service.impl.TransformationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

/**
 * 成果转化控制器
 */
@RestController
@RequestMapping("/transformations")
public class TransformationController {
    
    @Autowired
    private TransformationServiceImpl transformationService;
    
    /**
     * 分页查询成果转化列表
     */
    @GetMapping
    public Result<PageResult<TransformationDTO>> getList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String keyword) {
        PageResult<TransformationDTO> result = transformationService.listDTO(page, pageSize, status, type, keyword);
        return Result.success(result);
    }
    
    /**
     * 根据ID查询成果转化详情
     */
    @GetMapping("/{id}")
    public Result<TransformationDTO> getById(@PathVariable Long id) {
        TransformationDTO transformation = transformationService.getDTOById(id);
        return Result.success(transformation);
    }
    
    /**
     * 根据成果ID查询转化记录
     */
    @GetMapping("/achievement/{achievementId}")
    public Result<PageResult<TransformationDTO>> getByAchievementId(
            @PathVariable Long achievementId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        PageResult<TransformationDTO> result = transformationService.getByAchievementIdDTO(achievementId, page, pageSize);
        return Result.success(result);
    }
    
    /**
     * 创建成果转化
     */
    @PostMapping("/achievement/{achievementId}")
    public Result<Long> create(
            @PathVariable Long achievementId,
            @Valid @RequestBody TransformationCreateDTO dto) {
        Long id = transformationService.createFromDTO(dto, achievementId);
        return Result.success(id);
    }
    
    /**
     * 更新成果转化
     */
    @PutMapping("/{id}")
    public Result<Boolean> update(
            @PathVariable Long id,
            @Valid @RequestBody TransformationUpdateDTO dto) {
        boolean success = transformationService.updateFromDTO(id, dto);
        return Result.success(success);
    }
    
    /**
     * 审核成果转化
     */
    @PostMapping("/{id}/review")
    public Result<Boolean> review(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String comment) {
        boolean success = transformationService.review(id, status, comment);
        return Result.success(success);
    }
    
    /**
     * 删除成果转化
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        boolean success = transformationService.deleteById(id);
        return Result.success(success);
    }
}
