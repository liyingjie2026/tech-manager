package com.research.project.service.impl;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Achievement;
import com.research.project.entity.Transformation;
import com.research.project.mapper.AchievementMapper;
import com.research.project.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 成果服务实现类
 */
@Service
@RequiredArgsConstructor
public class AchievementServiceImpl implements AchievementService {
    
    private final AchievementMapper achievementMapper;
    
    
    @Override
    public PageResult<AchievementDTO> list(long page, long size, String keyword, String type, String status) {
        Page<Achievement> pageParam = new Page<>(page, size);
        QueryWrapper<Achievement> wrapper = new QueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like("name", keyword).or().like("description", keyword);
        }
        if (type != null && !type.isEmpty()) {
            wrapper.eq("type", type);
        }
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
        }
        IPage<Achievement> pageResult = achievementMapper.selectPage(pageParam, wrapper);
        
        List<AchievementDTO> records = pageResult.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        long totalPages = (pageResult.getTotal() + size - 1) / size;
        // 修改为正确的构造函数调用
        return new PageResult<>(page, size, pageResult.getTotal(), records);

    }

    @Override
    public AchievementDetailDTO getById(Long id) {
        Achievement achievement = achievementMapper.selectById(id);
        if (achievement == null) {
            throw new RuntimeException("成果不存在");
        }
        // 转换为DTO
        return convertToDetailDTO(achievement);
    }
    
    @Override
    public List<AchievementDTO> getByProject(Long projectId) {
        List<Achievement> achievements = achievementMapper.selectByProjectId(projectId);
        return achievements.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public Long create(AchievementCreateDTO dto) {
        Achievement achievement = new Achievement();
        // 设置属性
        achievement.setName(dto.getAchievementName());
        achievement.setType(dto.getAchievementType());
        achievement.setProjectId(dto.getProjectId());
        achievement.setDescription(dto.getDescription());
        achievement.setCreateTime(LocalDateTime.now());
        achievementMapper.insert(achievement);
        return achievement.getId();
    }
    
    @Override
    public void update(Long id, AchievementUpdateDTO dto) {
        Achievement achievement = achievementMapper.selectById(id);
        if (achievement == null) {
            throw new RuntimeException("成果不存在");
        }
        // 更新属性
        achievement.setName(dto.getAchievementName());
        achievement.setType(dto.getAchievementType());
        achievement.setDescription(dto.getDescription());
        achievement.setUpdateTime(LocalDateTime.now());
        achievementMapper.updateById(achievement);
    }
    
    @Override
    public void delete(Long id) {
        achievementMapper.deleteById(id);
    }
    
    @Override
    public void submit(Long id) {
        Achievement achievement = achievementMapper.selectById(id);
        if (achievement == null) {
            throw new RuntimeException("成果不存在");
        }
        achievement.setStatus("pending_review");
        achievement.setUpdateTime(LocalDateTime.now());
        achievementMapper.updateById(achievement);
    }
    
    @Override
    public void approve(Long id, String comment) {
        Achievement achievement = achievementMapper.selectById(id);
        if (achievement == null) {
            throw new RuntimeException("成果不存在");
        }
        achievement.setStatus("approved");
        achievement.setUpdateTime(LocalDateTime.now());
        achievementMapper.updateById(achievement);
    }
    
    @Override
    public void reject(Long id, String reason) {
        Achievement achievement = achievementMapper.selectById(id);
        if (achievement == null) {
            throw new RuntimeException("成果不存在");
        }
        achievement.setStatus("rejected");
        achievement.setUpdateTime(LocalDateTime.now());
        achievementMapper.updateById(achievement);
    }
    
    @Override
    public AttachmentDTO uploadAttachment(Long id, MultipartFile file) {
        // 实现文件上传逻辑
        AttachmentDTO dto = new AttachmentDTO();
        dto.setFileName(file.getOriginalFilename());
        dto.setFileSize(file.getSize());
        // 保存文件到服务器
        // file.transferTo(new File("/path/to/save/" + file.getOriginalFilename()));
        return dto;
    }
    
    @Override
    public String downloadAttachment(Long id, Long attachmentId) {
        // 返回文件下载URL
        return "/files/" + attachmentId;
    }
    
    @Override
    public PageResult<TransformationDTO> listTransformation(long page, long size, String keyword, String status) {
        Page<Object> pageParam = new Page<>(page, size);
        IPage<Object> pageResult = achievementMapper.selectTransformations(pageParam);
        
        List<TransformationDTO> records = new ArrayList<>();
        for (Object obj : pageResult.getRecords()) {
            if (obj instanceof Transformation) {
                records.add(convertToTransformationDTO((Transformation) obj));
            }
        }

        // 修改为正确的构造函数调用
        return new PageResult<>(page, size, pageResult.getTotal(), records);
    }
    
    @Override
    public Long createTransformation(Long id, TransformationCreateDTO dto) {
        Transformation transformation = new Transformation();
        transformation.setAchievementId(id);
        transformation.setContent(dto.getTransformationDesc());
        transformation.setType(dto.getTransformationType());
        transformation.setUnit(dto.getTransformationUnit());
        transformation.setCreateTime(LocalDateTime.now());
        
        achievementMapper.insertTransformation(id, dto);
        return transformation.getId();
    }
    
    @Override
    public void updateTransformation(Long transformationId, TransformationUpdateDTO dto) {
        achievementMapper.updateTransformation(transformationId, dto);
    }
    
    @Override
    public void submitTransformation(Long transformationId) {
        achievementMapper.updateTransformationStatus(transformationId, "pending");
    }
    
    @Override
    public void auditTransformation(Long transformationId, AuditDTO dto) {
        achievementMapper.updateTransformationAudit(transformationId, dto.getResult(), dto.getComment());
    }
    
    @Override
    public void publish(Long id) {
        achievementMapper.updatePublishStatus(id, true);
    }
    
    @Override
    public void unpublish(Long id) {
        achievementMapper.updatePublishStatus(id, false);
    }
    
    @Override
    public PageResult<AchievementDTO> listPublished(long page, long size, String field) {
        Page<Achievement> pageParam = new Page<>(page, size);
        IPage<Achievement> pageResult = achievementMapper.selectPublishedPage(pageParam, field);
        
        List<AchievementDTO> records = pageResult.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        // 修改为正确的构造函数调用
        return new PageResult<>(page, size, pageResult.getTotal(), records);
    }
    
    private AchievementDTO convertToDTO(Achievement achievement) {
        AchievementDTO dto = new AchievementDTO();
        dto.setId(achievement.getId());
        dto.setAchievementNo(achievement.getAchievementNo());
        dto.setProjectId(achievement.getProjectId());
        dto.setProjectName(achievement.getProjectName());
        dto.setTitle(achievement.getTitle());
        dto.setName(achievement.getName());
        dto.setType(achievement.getType());
        dto.setField(achievement.getField());
        dto.setCompletionUnit(achievement.getCompletionUnit());
        dto.setCompletionPerson(achievement.getCompletionPerson());
        dto.setCompletionDate(achievement.getCompletionDate());
        dto.setDescription(achievement.getDescription());
        dto.setDetail(achievement.getDetail());
        dto.setKeywords(achievement.getKeywords());
        dto.setAttachments(achievement.getAttachments());
        dto.setIsPublic(achievement.getIsPublic());
        dto.setIsPromoted(achievement.getIsPromoted());
        dto.setPublished(achievement.getPublished());
        dto.setViewCount(achievement.getViewCount());
        dto.setDownloadCount(achievement.getDownloadCount());
        dto.setStatus(achievement.getStatus());
        dto.setAuditComment(achievement.getAuditComment());
        dto.setAuditTime(achievement.getAuditTime());
        dto.setAuditBy(achievement.getAuditBy());
        dto.setCreateTime(achievement.getCreateTime());
        dto.setUpdateTime(achievement.getUpdateTime());
        dto.setCreateBy(achievement.getCreateBy());
        dto.setUpdateBy(achievement.getUpdateBy());
        return dto;
    }
    
    private AchievementDetailDTO convertToDetailDTO(Achievement achievement) {
        AchievementDetailDTO dto = new AchievementDetailDTO();
        dto.setId(achievement.getId());
        dto.setAchievementNo(achievement.getAchievementNo());
        dto.setProjectId(achievement.getProjectId());
        dto.setProjectName(achievement.getProjectName());
        dto.setTitle(achievement.getTitle());
        dto.setName(achievement.getName());
        dto.setType(achievement.getType());
        dto.setField(achievement.getField());
        dto.setCompletionUnit(achievement.getCompletionUnit());
        dto.setCompletionPerson(achievement.getCompletionPerson());
        dto.setCompletionDate(achievement.getCompletionDate());
        dto.setDescription(achievement.getDescription());
        dto.setDetail(achievement.getDetail());
        dto.setKeywords(achievement.getKeywords());
        dto.setIsPublic(achievement.getIsPublic());
        dto.setIsPromoted(achievement.getIsPromoted());
        dto.setPublished(achievement.getPublished());
        dto.setViewCount(achievement.getViewCount());
        dto.setDownloadCount(achievement.getDownloadCount());
        dto.setStatus(achievement.getStatus());
        dto.setAuditComment(achievement.getAuditComment());
        dto.setAuditTime(achievement.getAuditTime());
        dto.setAuditBy(achievement.getAuditBy());
        dto.setCreateTime(achievement.getCreateTime());
        dto.setUpdateTime(achievement.getUpdateTime());
        dto.setCreateBy(achievement.getCreateBy());
        
        List<Object> attachmentObjs = achievementMapper.selectAttachmentsByAchievementId(achievement.getId());
        List<AttachmentDTO> attachments = attachmentObjs.stream()
                .filter(obj -> obj instanceof AttachmentDTO)
                .map(obj -> (AttachmentDTO) obj)
                .collect(Collectors.toList());
        dto.setAttachments(attachments);
        
        return dto;
    }
    
    private TransformationDTO convertToTransformationDTO(Transformation transformation) {
        TransformationDTO dto = new TransformationDTO();
        dto.setId(transformation.getId());
        dto.setAchievementId(transformation.getAchievementId());
        dto.setDescription(transformation.getContent());
        dto.setStatus(transformation.getStatus());
        dto.setTransformationType(transformation.getType());
        return dto;
    }
}
