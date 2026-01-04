package com.research.project.service.impl;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Annual;
import com.research.project.mapper.AnnualMapper;
import com.research.project.service.AnnualService;
import com.research.project.service.TodoGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;

/**
 * 年度检查服务实现类
 */
@Service
@RequiredArgsConstructor
public class AnnualServiceImpl implements AnnualService {
    
    private final AnnualMapper annualMapper;
    private final TodoGeneratorService todoGeneratorService;

    @Override
    public PageResult<AnnualDTO> list(long page, long size, String keyword, String status, String year) {
        LambdaQueryWrapper<Annual> wrapper = new LambdaQueryWrapper<>();
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            wrapper.and(w -> w.like(Annual::getProjectName, keyword)
                    .or().like(Annual::getProjectNo, keyword));
        }
        if (status != null && !status.trim().isEmpty()) {
            wrapper.eq(Annual::getStatus, status);
        }
        if (year != null && !year.trim().isEmpty()) {
            wrapper.eq(Annual::getCheckYear,year);
        }
        wrapper.orderByDesc(Annual::getCreateTime);
        
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<Annual> pageParam = 
            new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(page, size);
        com.baomidou.mybatisplus.core.metadata.IPage<Annual> result = annualMapper.selectPage(pageParam, wrapper);
        
        List<AnnualDTO> records = new ArrayList<>();
        for (Annual annual : result.getRecords()) {
            AnnualDTO dto = new AnnualDTO();
            dto.setId(annual.getId());
            dto.setProjectId(annual.getProjectId());
            dto.setProjectNo(annual.getProjectNo());
            dto.setProjectName(annual.getProjectName());
            dto.setCheckYear(annual.getCheckYear());
            dto.setStatus(annual.getStatus());
            dto.setInstitutionName(annual.getInstitutionName());
            dto.setYearBudget(annual.getYearBudget());
            dto.setCreateTime(annual.getCreateTime());
            dto.setUsedBudget(annual.getUsedBudget());
            dto.setProjectLeader(annual.getProjectLeader());
            dto.setSubmitTime(annual.getSubmitTime());
            records.add(dto);
        }
        
        return new PageResult<>(result.getTotal(), records);
    }

    @Override
    public AnnualDetailDTO getById(Long id) {
        Annual annual = annualMapper.selectById(id);
        if (annual == null) {
            throw new RuntimeException("年度检查不存在");
        }
        
        AnnualDetailDTO dto = new AnnualDetailDTO();
        dto.setId(annual.getId());
        dto.setProjectId(annual.getProjectId());
        dto.setProjectNo(annual.getProjectNo());
        dto.setProjectName(annual.getProjectName());
        dto.setYear(annual.getCheckYear());
        dto.setStatus(annual.getStatus());
        dto.setExecutionProgress(annual.getCompletedWork());
        dto.setCreatedAt(annual.getCreateTime());
        dto.setUpdatedAt(annual.getUpdateTime());
        return dto;
    }
    
    @Override
    public AnnualStatisticsDTO getStatistics() {
        AnnualStatisticsDTO dto = new AnnualStatisticsDTO();
        dto.setTotal(annualMapper.selectCount(null).intValue());
        
        LambdaQueryWrapper<Annual> pendingWrapper = new LambdaQueryWrapper<>();
        pendingWrapper.eq(Annual::getStatus, "submitted");
        dto.setPending(annualMapper.selectCount(pendingWrapper).intValue());
        
        LambdaQueryWrapper<Annual> approvedWrapper = new LambdaQueryWrapper<>();
        approvedWrapper.eq(Annual::getStatus, "approved");
        dto.setApproved(annualMapper.selectCount(approvedWrapper).intValue());
        
        LambdaQueryWrapper<Annual> rejectedWrapper = new LambdaQueryWrapper<>();
        rejectedWrapper.eq(Annual::getStatus, "rejected");
        dto.setRejected(annualMapper.selectCount(rejectedWrapper).intValue());
        
        return dto;
    }
    
    @Override
    @Transactional
    public Long create(AnnualCreateDTO dto) {
        Annual annual = new Annual();
        annual.setProjectId(dto.getProjectId());
        annual.setCheckYear(dto.getYear());
        annual.setAnnualSummary(dto.getWorkProgress());
        annual.setStatus("draft");
        annual.setCreateTime(LocalDateTime.now());
        annual.setUpdateTime(LocalDateTime.now());
        annualMapper.insert(annual);
        return annual.getId();
    }
    
    @Override
    @Transactional
    public void update(Long id, AnnualUpdateDTO dto) {
        Annual annual = annualMapper.selectById(id);
        if (annual == null) {
            throw new RuntimeException("年度检查不存在");
        }
        
        if (dto.getWorkProgress() != null) {
            annual.setAnnualSummary(dto.getWorkProgress());
        }
        annual.setUpdateTime(LocalDateTime.now());
        annualMapper.updateById(annual);
    }
    
    @Override
    @Transactional
    public void submit(Long id) {
        Annual annual = annualMapper.selectById(id);
        if (annual == null) {
            throw new RuntimeException("年度检查不存在");
        }
        
        if (!"draft".equals(annual.getStatus()) && !"rejected".equals(annual.getStatus())) {
            throw new RuntimeException("当前状态不允许提交");
        }
        
        annual.setStatus("submitted");
        annual.setSubmitTime(LocalDateTime.now());
        annual.setUpdateTime(LocalDateTime.now());
        annualMapper.updateById(annual);
        
        todoGeneratorService.generateAnnualReviewTodo(annual.getProjectId(), Integer.parseInt(annual.getCheckYear()));
    }
    
    @Override
    @Transactional
    public void approve(Long id, String comment) {
        Annual annual = annualMapper.selectById(id);
        if (annual == null) {
            throw new RuntimeException("年度检查不存在");
        }
        
        if (!"submitted".equals(annual.getStatus())) {
            throw new RuntimeException("只能审核已提交的年度检查");
        }
        
        annual.setStatus("approved");
        annual.setAuditComment(comment);
        annual.setAuditTime(LocalDateTime.now());
        annual.setUpdateTime(LocalDateTime.now());
        annualMapper.updateById(annual);
        
        // 可扩展：发送审核通过通知
    }
    
    @Override
    @Transactional
    public void reject(Long id, String reason) {
        Annual annual = annualMapper.selectById(id);
        if (annual == null) {
            throw new RuntimeException("年度检查不存在");
        }
        
        if (!"submitted".equals(annual.getStatus())) {
            throw new RuntimeException("只能驳回已提交的年度检查");
        }
        
        if (reason == null || reason.trim().isEmpty()) {
            throw new RuntimeException("驳回原因不能为空");
        }
        
        annual.setStatus("rejected");
        annual.setAuditComment(reason);
        annual.setAuditTime(LocalDateTime.now());
        annual.setUpdateTime(LocalDateTime.now());
        annualMapper.updateById(annual);
        
        // 可扩展：发送驳回通知给项目负责人
    }
    
    @Override
    @Transactional
    public void sendNotice(AnnualNoticeDTO dto) {
        if (dto.getProjectIds() == null || dto.getProjectIds().isEmpty()) {
            throw new RuntimeException("通知项目列表不能为空");
        }
        
        for (Long projectId : dto.getProjectIds()) {
            Annual annual = new Annual();
            annual.setProjectId(projectId);
            annual.setCheckYear(String.valueOf(dto.getYear()));
            annual.setStatus("draft");
            annual.setCreateTime(LocalDateTime.now());
            annual.setUpdateTime(LocalDateTime.now());
            annualMapper.insert(annual);
            
            todoGeneratorService.generateAnnualSubmitTodo(annual);
        }
        
        // 可扩展：发送通知消息/邮件
    }
    
    @Override
    @Transactional
    public AttachmentDTO uploadAttachment(Long id, MultipartFile file, String type) {
        AttachmentDTO dto = new AttachmentDTO();
        dto.setId(System.currentTimeMillis());
        dto.setFileName(file.getOriginalFilename());
        dto.setFileSize(file.getSize());
        dto.setFileType(type);
        dto.setUploadTime(LocalDateTime.now());
        return dto;
    }
}
