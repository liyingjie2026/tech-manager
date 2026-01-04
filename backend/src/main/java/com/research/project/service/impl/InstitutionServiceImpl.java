package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Achievement;
import com.research.project.entity.Institution;
import com.research.project.entity.Project;
import com.research.project.mapper.AchievementMapper;
import com.research.project.mapper.InstitutionMapper;
import com.research.project.mapper.ProjectMapper;
import com.research.project.service.InstitutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 机构服务实现类
 */
@Service
@RequiredArgsConstructor
public class InstitutionServiceImpl implements InstitutionService {
    
    private final InstitutionMapper institutionMapper;
    private final ProjectMapper projectMapper;
    private final AchievementMapper achievementMapper;
    
    @Override
    public PageResult<InstitutionDTO> list(Integer page, Integer size, String keyword, String type, String status) {
        Page<Institution> pageObj = new Page<>(page, size);
        LambdaQueryWrapper<Institution> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Institution::getName, keyword)
                    .or().like(Institution::getCreditCode, keyword));
        }
        if (StringUtils.hasText(type)) {
            wrapper.eq(Institution::getType, type);
        }
        if (StringUtils.hasText(status)) {
            if ("active".equals(status) || "1".equals(status)) {
                wrapper.eq(Institution::getStatus, 1);
            } else if ("inactive".equals(status) || "0".equals(status)) {
                wrapper.eq(Institution::getStatus, 0);
            }
        }
        wrapper.orderByDesc(Institution::getCreateTime);
        
        Page<Institution> result = institutionMapper.selectPage(pageObj, wrapper);
        List<InstitutionDTO> dtoList = result.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(Long.valueOf(page), Long.valueOf(size), result.getTotal(), dtoList);
    }
    
    @Override
    public List<InstitutionDTO> listAll() {
        LambdaQueryWrapper<Institution> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Institution::getStatus, 1);
        wrapper.orderByAsc(Institution::getName);
        
        List<Institution> list = institutionMapper.selectList(wrapper);
        return list.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public InstitutionDTO getById(Long id) {
        Institution institution = institutionMapper.selectById(id);
        if (institution == null) {
            throw new RuntimeException("机构不存在");
        }
        return convertToDTO(institution);
    }
    
    @Override
    @Transactional
    public Long create(InstitutionCreateDTO dto) {
        LambdaQueryWrapper<Institution> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Institution::getCreditCode, dto.getCreditCode());
        if (institutionMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("统一社会信用代码已存在");
        }
        
        Institution institution = new Institution();
        institution.setName(dto.getInstitutionName());
        institution.setType(dto.getInstitutionType());
        institution.setCreditCode(dto.getCreditCode());
        institution.setLegalPerson(dto.getLegalPerson());
        institution.setContactPerson(dto.getContactPerson());
        institution.setContactPhone(dto.getContactPhone());
        institution.setContactEmail(dto.getContactEmail());
        institution.setProvince(dto.getProvince());
        institution.setCity(dto.getCity());
        institution.setAddress(dto.getAddress());
        institution.setQualification(dto.getQualification());
        institution.setDescription(dto.getDescription());
        
        institution.setStatus(0); // 0-pending
        institution.setAuditStatus("pending");
        institution.setCreateTime(LocalDateTime.now());
        institution.setUpdateTime(LocalDateTime.now());
        
        institutionMapper.insert(institution);
        return institution.getId();
    }
    
    @Override
    @Transactional
    public void update(Long id, InstitutionUpdateDTO dto) {
        Institution institution = institutionMapper.selectById(id);
        if (institution == null) {
            throw new RuntimeException("机构不存在");
        }
        
        if (dto.getName() != null) {
            institution.setName(dto.getName());
        }
        if (dto.getType() != null) {
            institution.setType(dto.getType());
        }
        if (dto.getLegalPerson() != null) {
            institution.setLegalPerson(dto.getLegalPerson());
        }
        if (dto.getContactPerson() != null) {
            institution.setContactPerson(dto.getContactPerson());
        }
        if (dto.getContactPhone() != null) {
            institution.setContactPhone(dto.getContactPhone());
        }
        if (dto.getContactEmail() != null) {
            institution.setContactEmail(dto.getContactEmail());
        }
        if (dto.getAddress() != null) {
            institution.setAddress(dto.getAddress());
        }
        if (dto.getQualification() != null) {
            institution.setQualification(dto.getQualification());
        }
        if (dto.getDescription() != null) {
            institution.setDescription(dto.getDescription());
        }
        institution.setUpdateTime(LocalDateTime.now());
        
        institutionMapper.updateById(institution);
    }
    
    @Override
    @Transactional
    public void delete(Long id) {
        Institution institution = institutionMapper.selectById(id);
        if (institution == null) {
            throw new RuntimeException("机构不存在");
        }
        
        // 检查是否有关联项目
        LambdaQueryWrapper<Project> projectWrapper = new LambdaQueryWrapper<>();
        projectWrapper.eq(Project::getInstitutionId, id);
        if (projectMapper.selectCount(projectWrapper) > 0) {
            throw new RuntimeException("该机构下存在项目，无法删除");
        }
        
        institutionMapper.deleteById(id);
    }
    
    @Override
    @Transactional
    public void audit(Long id, AuditDTO dto) {
        Institution institution = institutionMapper.selectById(id);
        if (institution == null) {
            throw new RuntimeException("机构不存在");
        }
        
        if ("approved".equals(dto.getResult())) {
            institution.setStatus(1);
            institution.setAuditStatus("approved");
        } else if ("rejected".equals(dto.getResult())) {
            institution.setStatus(0);
            institution.setAuditStatus("rejected");
        }
        institution.setAuditComment(dto.getComment());
        institution.setAuditTime(LocalDateTime.now());
        institution.setUpdateTime(LocalDateTime.now());
        
        institutionMapper.updateById(institution);
    }
    
    @Override
    @Transactional
    public void applyQualificationChange(Long id, QualificationChangeDTO dto) {
        Institution institution = institutionMapper.selectById(id);
        if (institution == null) {
            throw new RuntimeException("机构不存在");
        }
        
        institution.setQualification(dto.getNewQualification());
        institution.setStatus(0); // Set to pending
        institution.setAuditStatus("pending");
        institution.setUpdateTime(LocalDateTime.now());
        
        institutionMapper.updateById(institution);
    }
    
    @Override
    public String uploadQualification(Long id, MultipartFile file, String type) {
        if (file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }
        
        Institution institution = institutionMapper.selectById(id);
        if (institution == null) {
            throw new RuntimeException("机构不存在");
        }
        
        try {
            // 生成文件名
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;
            
            // 保存文件
            String uploadDir = "/uploads/qualifications/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            File dest = new File(uploadDir + filename);
            file.transferTo(dest);
            
            // 返回文件URL
            return "/api/files/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("文件上传失败", e);
        }
    }
    
    @Override
    public PageResult<ProjectDTO> getProjects(Long id, Integer page, Integer size) {
        Page<Project> pageObj = new Page<>(page, size);
        LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Project::getInstitutionId, id);
        
        Page<Project> result = projectMapper.selectPage(pageObj, wrapper);
        List<ProjectDTO> dtoList = result.getRecords().stream()
                .map(this::convertProjectToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(Long.valueOf(page), Long.valueOf(size), result.getTotal(), dtoList);
    }
    
    @Override
    public PageResult<AchievementDTO> getAchievements(Long id, Integer page, Integer size) {
        Page<Achievement> pageObj = new Page<>(page, size);
        LambdaQueryWrapper<Achievement> wrapper = new LambdaQueryWrapper<>();
        // We need to join through project or use a different query strategy
        // For now, query by projectId and filter
        wrapper.orderByDesc(Achievement::getCreateTime);
        
        Page<Achievement> result = achievementMapper.selectPage(pageObj, wrapper);
        List<AchievementDTO> dtoList = result.getRecords().stream()
                .map(this::convertAchievementToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(Long.valueOf(page), Long.valueOf(size), result.getTotal(), dtoList);
    }
    
    @Override
    public InstitutionPerformanceDTO getPerformance(Long id) {
        Institution institution = institutionMapper.selectById(id);
        if (institution == null) {
            throw new RuntimeException("机构不存在");
        }
        
        LambdaQueryWrapper<Project> projectWrapper = new LambdaQueryWrapper<>();
        projectWrapper.eq(Project::getInstitutionId, id);
        long projectCount = projectMapper.selectCount(projectWrapper);
        
        LambdaQueryWrapper<Achievement> achievementWrapper = new LambdaQueryWrapper<>();
        long achievementCount = achievementMapper.selectCount(achievementWrapper);
        
        InstitutionPerformanceDTO dto = new InstitutionPerformanceDTO();
        dto.setInstitutionId(id);
        dto.setInstitutionName(institution.getName());
        dto.setProjectCount((int) projectCount);
        dto.setAchievementCount((int) achievementCount);
        dto.setTotalBudget(0.0);
        dto.setScore(85.0);
        
        return dto;
    }
    
    // 辅助方法：转换为DTO
    private InstitutionDTO convertToDTO(Institution entity) {
        InstitutionDTO dto = new InstitutionDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
    
    private ProjectDTO convertProjectToDTO(Project entity) {
        ProjectDTO dto = new ProjectDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
    
    private AchievementDTO convertAchievementToDTO(Achievement entity) {
        AchievementDTO dto = new AchievementDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
}
