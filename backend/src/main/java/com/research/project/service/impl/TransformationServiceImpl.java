package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.research.project.common.PageResult;
import com.research.project.dto.TransformationDTO;
import com.research.project.dto.TransformationCreateDTO;
import com.research.project.dto.TransformationUpdateDTO;
import com.research.project.entity.Transformation;
import com.research.project.mapper.TransformationMapper;
import com.research.project.service.TransformationService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 成果转化服务实现类
 */
@Service
public class TransformationServiceImpl extends ServiceImpl<TransformationMapper, Transformation> implements TransformationService {
    
    @Override
    public Page<Transformation> getList(int page, int pageSize, String status, String type, String keyword) {
        Page<Transformation> pageObj = new Page<>(page, pageSize);
        LambdaQueryWrapper<Transformation> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(status)) {
            wrapper.eq(Transformation::getStatus, status);
        }
        
        if (StringUtils.hasText(type)) {
            wrapper.eq(Transformation::getType, type);
        }
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Transformation::getTransformationNo, keyword)
                    .or().like(Transformation::getContent, keyword)
                    .or().like(Transformation::getUnit, keyword));
        }
        
        wrapper.orderByDesc(Transformation::getCreateTime);
        
        return this.page(pageObj, wrapper);
    }
    
    public PageResult<TransformationDTO> listDTO(int page, int pageSize, String status, String type, String keyword) {
        Page<Transformation> pageResult = getList(page, pageSize, status, type, keyword);
        List<TransformationDTO> dtoList = pageResult.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new PageResult<>((long) page, (long) pageSize, pageResult.getTotal(), dtoList);
    }
    
    @Override
    public Page<Transformation> getByAchievementId(Long achievementId, int page, int pageSize) {
        Page<Transformation> pageObj = new Page<>(page, pageSize);
        LambdaQueryWrapper<Transformation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Transformation::getAchievementId, achievementId);
        wrapper.orderByDesc(Transformation::getCreateTime);
        
        return this.page(pageObj, wrapper);
    }
    
    public PageResult<TransformationDTO> getByAchievementIdDTO(Long achievementId, int page, int pageSize) {
        Page<Transformation> pageResult = getByAchievementId(achievementId, page, pageSize);
        List<TransformationDTO> dtoList = pageResult.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new PageResult<>((long) page, (long) pageSize, pageResult.getTotal(), dtoList);
    }
    
    @Override
    public boolean create(Transformation transformation) {
        transformation.setStatus("draft");
        transformation.setCreateTime(LocalDateTime.now());
        return this.save(transformation);
    }
    
    public Long createFromDTO(TransformationCreateDTO dto, Long achievementId) {
        Transformation transformation = new Transformation();
        transformation.setAchievementId(achievementId);
        transformation.setType(dto.getTransformationType());
        transformation.setUnit(dto.getTransformationUnit());
        transformation.setContent(dto.getTransformationDesc());
        transformation.setValue(dto.getTransformationValue() != null ? dto.getTransformationValue().toString() : null);
        transformation.setAttachments(dto.getAttachments());
        transformation.setStatus("draft");
        transformation.setCreateTime(LocalDateTime.now());
        this.save(transformation);
        return transformation.getId();
    }
    
    @Override
    public boolean update(Transformation transformation) {
        transformation.setUpdateTime(LocalDateTime.now());
        return this.updateById(transformation);
    }
    
    public boolean updateFromDTO(Long id, TransformationUpdateDTO dto) {
        Transformation transformation = this.getById(id);
        if (transformation == null) {
            return false;
        }
        transformation.setType(dto.getTransformationType());
        transformation.setUnit(dto.getTransformationUnit());
        transformation.setContent(dto.getTransformationDesc());
        transformation.setValue(dto.getTransformationValue() != null ? dto.getTransformationValue().toString() : null);
        transformation.setAttachments(dto.getAttachments());
        transformation.setUpdateTime(LocalDateTime.now());
        return this.updateById(transformation);
    }
    
    @Override
    public boolean review(Long id, String status, String comment) {
        Transformation transformation = this.getById(id);
        if (transformation == null) {
            return false;
        }
        
        transformation.setStatus(status);
        transformation.setComment(comment);
        transformation.setUpdateTime(LocalDateTime.now());
        return this.updateById(transformation);
    }
    
    @Override
    public boolean deleteById(Long id) {
        return this.removeById(id);
    }
    
    public TransformationDTO getDTOById(Long id) {
        Transformation transformation = this.getById(id);
        return transformation != null ? convertToDTO(transformation) : null;
    }
    
    private TransformationDTO convertToDTO(Transformation entity) {
        TransformationDTO dto = new TransformationDTO();
        dto.setId(entity.getId());
        dto.setAchievementId(entity.getAchievementId());
        dto.setTransformationNo(entity.getTransformationNo());
        dto.setContent(entity.getContent());
        dto.setType(entity.getType());
        dto.setUnit(entity.getUnit());
        dto.setPrincipal(entity.getPrincipal());
        dto.setContact(entity.getContact());
        dto.setStatus(entity.getStatus());
        dto.setComment(entity.getComment());
        dto.setValue(entity.getValue());
        dto.setAttachments(entity.getAttachments());
        dto.setCreateTime(entity.getCreateTime());
        dto.setUpdateTime(entity.getUpdateTime());
        dto.setCreateBy(entity.getCreateBy());
        dto.setUpdateBy(entity.getUpdateBy());
        return dto;
    }
}
