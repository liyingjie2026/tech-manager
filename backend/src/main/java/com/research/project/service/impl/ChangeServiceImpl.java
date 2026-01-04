package com.research.project.service.impl;

import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Change;
import com.research.project.mapper.ChangeMapper;
import com.research.project.service.ChangeService;
import com.research.project.service.TodoGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 变更服务实现类
 */
@Service
@RequiredArgsConstructor
public class ChangeServiceImpl implements ChangeService {
    
    private final ChangeMapper changeMapper;
    private final TodoGeneratorService todoGeneratorService;
    
    @Override
    public PageResult<ChangeDTO> list(Integer page, Integer size, String keyword, String status, String changeType) {
        // 构建查询条件
        int offset = (page - 1) * size;
        
        List<Change> changes = changeMapper.selectByConditions(keyword, status, changeType, offset, size);
        List<ChangeDTO> records = changes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        long total = changeMapper.countByConditions(keyword, status, changeType);
        
        return new PageResult<>(Long.valueOf(total), records);
    }
    
    @Override
    public ChangeDetailDTO getById(Long id) {
        Change change = changeMapper.selectById(id);
        if (change == null) {
            throw new RuntimeException("变更不存在");
        }
        return convertToDetailDTO(change);
    }
    
    @Override
    public List<ChangeDTO> getHistory(Long projectId) {
        List<Change> changes = changeMapper.selectByProjectId(projectId);
        return changes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(ChangeCreateDTO dto) {
        // 创建变更对象
        Change change = new Change();
        change.setProjectId(dto.getProjectId());
        change.setChangeType(dto.getChangeType());
        change.setChangeItem(dto.getNewContent());
        change.setChangeReason(dto.getChangeReason());
        change.setStatus("draft");
        change.setCreateTime(LocalDateTime.now());
        
        // 插入数据库
        changeMapper.insert(change);
        
        return change.getId();
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, ChangeUpdateDTO dto) {
        Change change = changeMapper.selectById(id);
        if (change == null) {
            throw new RuntimeException("变更不存在");
        }
        
        // 只有草稿状态才能更新
        if (!"draft".equals(change.getStatus())) {
            throw new RuntimeException("只有草稿状态的变更才能修改");
        }
        
        // 更新字段
        change.setChangeType(dto.getChangeType());
        change.setChangeItem(dto.getNewContent());
        change.setChangeReason(dto.getChangeReason());
        change.setUpdateTime(LocalDateTime.now());
        
        changeMapper.updateById(change);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void submit(Long id) {
        Change change = changeMapper.selectById(id);
        if (change == null) {
            throw new RuntimeException("变更不存在");
        }
        
        // 更新状态为待审核
        change.setStatus("pending");
        change.setApplyTime(LocalDateTime.now());
        change.setUpdateTime(LocalDateTime.now());
        
        changeMapper.updateById(change);
        
        todoGeneratorService.generateChangeReviewTodo(change);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void withdraw(Long id) {
        Change change = changeMapper.selectById(id);
        if (change == null) {
            throw new RuntimeException("变更不存在");
        }
        
        // 只有待审核状态才能撤回
        if (!"pending".equals(change.getStatus())) {
            throw new RuntimeException("只有待审核状态的变更才能撤回");
        }
        
        // 更新状态为草稿
        change.setStatus("draft");
        change.setUpdateTime(LocalDateTime.now());
        
        changeMapper.updateById(change);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Change change = changeMapper.selectById(id);
        if (change == null) {
            throw new RuntimeException("变更不存在");
        }
        
        // 只有草稿状态才能删除
        if (!"draft".equals(change.getStatus())) {
            throw new RuntimeException("只有草稿状态的变更才能删除");
        }
        
        changeMapper.deleteById(id);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void approve(Long id, String comment) {
        Change change = changeMapper.selectById(id);
        if (change == null) {
            throw new RuntimeException("变更不存在");
        }
        
        // 更新状态为已通过
        change.setStatus("approved");
        change.setAuditComment(comment);
        change.setAuditTime(LocalDateTime.now());
        change.setUpdateTime(LocalDateTime.now());
        
        changeMapper.updateById(change);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void reject(Long id, String reason) {
        Change change = changeMapper.selectById(id);
        if (change == null) {
            throw new RuntimeException("变更不存在");
        }
        
        // 更新状态为已驳回
        change.setStatus("rejected");
        change.setAuditComment(reason);
        change.setAuditTime(LocalDateTime.now());
        change.setUpdateTime(LocalDateTime.now());
        
        changeMapper.updateById(change);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void returnForModification(Long id, String reason) {
        Change change = changeMapper.selectById(id);
        if (change == null) {
            throw new RuntimeException("变更不存在");
        }
        
        // 更新状态为退回修改
        change.setStatus("returned");
        change.setAuditComment(reason);
        change.setAuditTime(LocalDateTime.now());
        change.setUpdateTime(LocalDateTime.now());
        
        changeMapper.updateById(change);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public AttachmentDTO uploadAttachment(Long id, MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }
        
        // In real implementation:
        // 1. Save file to storage system (OSS/FileSystem)
        // 2. Save attachment record to database
        // 3. Associate with change record
        
        AttachmentDTO dto = new AttachmentDTO();
        dto.setFileName(file.getOriginalFilename());
        dto.setFileSize(file.getSize());
        dto.setUploadTime(LocalDateTime.now());
        
        // Simplified implementation: save filename
        // In production: fileService.upload(file) and save URL
        
        return dto;
    }
    
    @Override
    public ChangeStatisticsDTO getStatistics(String changeType, String status) {
        ChangeStatisticsDTO dto = new ChangeStatisticsDTO();
        
        // 查询总数
        dto.setTotal(changeMapper.countByConditions(null, null, null));
        
        // 按状态统计
        dto.setDraft(changeMapper.countByConditions(null, "draft", changeType));
        dto.setSubmitted(changeMapper.countByConditions(null, "submitted", changeType));
        dto.setPending(changeMapper.countByConditions(null, "pending", changeType));
        dto.setApproved(changeMapper.countByConditions(null, "approved", changeType));
        dto.setRejected(changeMapper.countByConditions(null, "rejected", changeType));
        
        return dto;
    }
    
    // 辅助方法：转换为DTO
    private ChangeDTO convertToDTO(Change change) {
        ChangeDTO dto = new ChangeDTO();
        dto.setId(change.getId());
        dto.setProjectId(change.getProjectId());
        dto.setChangeType(change.getChangeType());
        dto.setChangedContent(change.getChangeItem());
        dto.setChangeReason(change.getChangeReason());
        dto.setChangeNo(change.getChangeNo());
        dto.setProjectNo(change.getProjectNo());
        dto.setProjectName(change.getProjectName());
        dto.setStatus(change.getStatus());
        dto.setInstitutionName(change.getApplyUnit());
        dto.setSubmitTime(change.getSubmitTime());
        dto.setAuditStatus(change.getStatus());

        // DTO doesn't have setStatus method, removed
        // DTO doesn't have setCreateTime method, removed
        return dto;
    }
    
    // 辅助方法：转换为详情DTO
    private ChangeDetailDTO convertToDetailDTO(Change change) {
        ChangeDetailDTO dto = new ChangeDetailDTO();
        dto.setId(change.getId());
        dto.setProjectId(change.getProjectId());
        dto.setChangeType(change.getChangeType());
        dto.setChangedContent(change.getChangeItem());
        dto.setReason(change.getChangeReason());
        dto.setStatus(change.getStatus());
        dto.setReviewComment(change.getAuditComment());
        dto.setCreateTime(change.getCreateTime());
        dto.setSubmitTime(change.getApplyTime());
        dto.setReviewTime(change.getAuditTime());
        return dto;
    }
}
