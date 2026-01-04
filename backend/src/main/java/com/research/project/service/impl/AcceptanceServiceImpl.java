package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.research.project.common.PageResult;
import com.research.project.commonenum.StatusEnum;
import com.research.project.dto.*;
import com.research.project.entity.Acceptance;
import com.research.project.mapper.AcceptanceMapper;
import com.research.project.service.AcceptanceService;
import com.research.project.service.TodoGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.LongAdder;

/**
 * 验收服务实现类
 */
@Service
@RequiredArgsConstructor
public class AcceptanceServiceImpl extends ServiceImpl<AcceptanceMapper, Acceptance> implements AcceptanceService {
    
    private final TodoGeneratorService todoGeneratorService;
    
    @Override
    public PageResult<AcceptanceDTO> list(Integer page, Integer size, String keyword, String status) {
        IPage<Acceptance> pageResult = pageAcceptances(page, size, keyword, status, null);
        List<AcceptanceDTO> dtoList = new ArrayList<>();
        
        for (Acceptance entity : pageResult.getRecords()) {
            AcceptanceDTO dto = new AcceptanceDTO();
            dto.setId(entity.getId());
            dto.setAcceptanceNo(entity.getAcceptanceNo());
            dto.setProjectId(entity.getProjectId());
            dto.setProjectNo(entity.getProjectNo());
            dto.setProjectLeader(entity.getProjectLeader());
            dto.setStartDate(entity.getStartDate());
            dto.setEndDate(entity.getEndDate());
            dto.setProjectName(entity.getProjectName());
            dto.setInstitutionName(entity.getInstitutionName());
            dto.setStatus(entity.getStatus());
            dto.setConclusion(entity.getConclusion());
            dto.setCreateTime(entity.getCreateTime());
            dto.setTotalBudget(entity.getTotalBudget());
            dto.setUsedBudget(entity.getUsedBudget());
            dto.setCreateTime(entity.getCreateTime());
            dto.setAcceptanceTime(entity.getAcceptanceTime());
            dto.setSubmitTime(entity.getSubmitTime());
            dtoList.add(dto);
        }
        
        return new PageResult<>(pageResult.getCurrent(), pageResult.getSize(), pageResult.getTotal(), dtoList);
    }
    
    @Override
    public AcceptanceDetailDTO getById(Long id) {
        Acceptance acceptance = baseMapper.selectById(id);
        if (acceptance == null) {
            throw new RuntimeException("验收记录不存在");
        }
        
        AcceptanceDetailDTO dto = new AcceptanceDetailDTO();
        org.springframework.beans.BeanUtils.copyProperties(acceptance, dto);
        return dto;
    }
    
    @Override
    public AcceptanceStatisticsDTO getStatistics() {
        Map<String, Object> stats = getStatisticsMap();
        
        AcceptanceStatisticsDTO dto = new AcceptanceStatisticsDTO();
        dto.setTotalCount(((Long) stats.getOrDefault("totalCount", 0)));
        dto.setPendingCount(((Long) stats.getOrDefault("pendingCount", 0)));
        dto.setAcceptedCount(((Long) stats.getOrDefault("acceptedCount", 0)));
        dto.setRejectedCount(((Long) stats.getOrDefault("rejectedCount", 0)));
        
        return dto;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(AcceptanceCreateDTO dto) {
        Acceptance acceptance = new Acceptance();
        org.springframework.beans.BeanUtils.copyProperties(dto, acceptance);
        acceptance.setStatus("draft");
        acceptance.setCreateTime(LocalDateTime.now());
        acceptance.setUpdateTime(LocalDateTime.now());
        
        baseMapper.insert(acceptance);
        return acceptance.getId();
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, AcceptanceUpdateDTO dto) {
        Acceptance acceptance = baseMapper.selectById(id);
        if (acceptance == null) {
            throw new RuntimeException("验收记录不存在");
        }
        
        org.springframework.beans.BeanUtils.copyProperties(dto, acceptance);
        acceptance.setUpdateTime(LocalDateTime.now());
        
        baseMapper.updateById(acceptance);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public AttachmentDTO uploadAttachment(Long id, MultipartFile file, String type) {
        Acceptance acceptance = baseMapper.selectById(id);
        if (acceptance == null) {
            throw new RuntimeException("验收记录不存在");
        }
        
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }
        
        // 创建附件记录
        AttachmentDTO dto = new AttachmentDTO();
        dto.setName(file.getOriginalFilename());
        dto.setSize(file.getSize());
        dto.setType(type);
        dto.setEntityType("acceptance");
        dto.setEntityId(id);
        dto.setUploadTime(LocalDateTime.now());
        
        // 实际场景需要：
        // 1. 上传文件到文件服务器/OSS
        // 2. 保存文件记录到附件表
        // 3. 关联附件到验收记录
        
        return dto;
    }
    
    @Override
    public String export(Long id) {
        Acceptance acceptance = baseMapper.selectById(id);
        if (acceptance == null) {
            throw new RuntimeException("验收记录不存在");
        }
        
        // In real implementation:
        // 1. Generate Excel/PDF using Apache POI or iText
        // 2. Upload to file server
        // 3. Return download URL
        String filename = "acceptance_" + acceptance.getAcceptanceNo() + "_" + System.currentTimeMillis() + ".xlsx";
        return "/exports/acceptance/" + filename;
    }
    
    @Override
    public byte[] exportAcceptance(Long id) {
        Acceptance acceptance = baseMapper.selectById(id);
        if (acceptance == null) {
            throw new RuntimeException("验收记录不存在");
        }
        
        // In real implementation:
        // 1. Create workbook with Apache POI
        // 2. Fill in acceptance data
        // 3. Convert to byte array
        // ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // workbook.write(baos);
        // return baos.toByteArray();
        
        String content = "Acceptance Export for: " + acceptance.getProjectName();
        return content.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }
    
    @Override
    public Acceptance getByProjectId(Long projectId) {
        return baseMapper.selectByProjectId(projectId);
    }
    
    @Override
    public IPage<Acceptance> pageAcceptances(Integer current, Integer size, String keyword, String status, String conclusion) {
        Page<Acceptance> page = new Page<>(current, size);
        LambdaQueryWrapper<Acceptance> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.like(Acceptance::getProjectName, keyword);
        }
        if (StringUtils.hasText(status)) {
            wrapper.eq(Acceptance::getStatus, status);
        }
        if (StringUtils.hasText(conclusion)) {
            wrapper.eq(Acceptance::getConclusion, conclusion);
        }
        wrapper.orderByDesc(Acceptance::getCreateTime);
        
        return baseMapper.selectPage(page, wrapper);
    }
    
    @Override
    public boolean submit(Long id) {
        boolean updated = baseMapper.updateStatus(id, StatusEnum.SUBMITTED.getCode()) > 0;
        
        if (updated) {
            Acceptance acceptance = baseMapper.selectById(id);
            todoGeneratorService.generateAcceptanceReviewTodo(acceptance);
        }
        
        return updated;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void startReview(Long id, AcceptanceReviewDTO dto) {
        Acceptance acceptance = baseMapper.selectById(id);
        if (acceptance == null) {
            throw new RuntimeException("验收记录不存在");
        }
        // 更新验收状态为评审中
        acceptance.setStatus("reviewing");
        baseMapper.updateById(acceptance);
        
        // 创建专家评审记录
        if (dto.getExpertIds() != null && !dto.getExpertIds().isEmpty()) {
            baseMapper.startExpertReview(id, dto.getExpertIds(), dto.getDeadline());
            
            for (Long expertId : dto.getExpertIds()) {
                todoGeneratorService.generateAcceptanceReviewTodo(acceptance);
            }
        }
    }
    
    @Override
    public boolean audit(Long id, String conclusion, String acceptanceComment) {
        return baseMapper.updateAudit(id, conclusion, acceptanceComment) > 0;
    }
    
    @Override
    public boolean withdraw(Long id) {
        return baseMapper.updateStatus(id, StatusEnum.DRAFT.getCode()) > 0;
    }
    
    @Override
    public boolean approve(Long id, String opinion) {
        return baseMapper.updateAudit(id, "approved", opinion) > 0;
    }
    
    @Override
    public boolean reject(Long id, String reason) {
        return baseMapper.updateAudit(id, "rejected", reason) > 0;
    }
    
    @Override
    public boolean addAttachments(Long id, List<Long> fileIds) {
        return baseMapper.insertAttachments(id, fileIds) > 0;
    }
    
    @Override
    public Map<String, Object> getStatisticsMap() {
        return baseMapper.selectStatistics();
    }
}
