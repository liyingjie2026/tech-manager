package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Midterm;
import com.research.project.mapper.MidtermMapper;
import com.research.project.service.MidtermService;
import com.research.project.service.TodoGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 中期检查服务实现类
 */
@Service
@RequiredArgsConstructor
public class MidtermServiceImpl implements MidtermService {
    
    private final MidtermMapper midtermMapper;
    private final TodoGeneratorService todoGeneratorService;
    
    @Override
    public PageResult<MidtermDTO> list(Integer page, Integer size, String keyword, String status, String year) {
        Page<Midterm> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Midterm> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Midterm::getProjectName, keyword)
                    .or().like(Midterm::getProjectNo, keyword));
        }
        if (StringUtils.hasText(status)) {
            wrapper.eq(Midterm::getStatus, status);
        }
        
        wrapper.orderByDesc(Midterm::getCreateTime);
        
        Page<Midterm> result = midtermMapper.selectPage(pageParam, wrapper);
        
        List<MidtermDTO> dtoList = result.getRecords().stream().map(entity -> {
            MidtermDTO dto = new MidtermDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        }).collect(Collectors.toList());
        
        return new PageResult<>(result.getCurrent(), result.getSize(), result.getTotal(), dtoList);
    }
    
    @Override
    public MidtermDetailDTO getById(Long id) {
        Midterm midterm = midtermMapper.selectById(id);
        if (midterm == null) {
            throw new RuntimeException("中期检查不存在");
        }
        
        MidtermDetailDTO dto = new MidtermDetailDTO();
        BeanUtils.copyProperties(midterm, dto);
        return dto;
    }
    
    @Override
    public MidtermStatisticsDTO getStatistics() {
        MidtermStatisticsDTO statistics = new MidtermStatisticsDTO();
        statistics.setTotalCount(midtermMapper.selectCount(null).intValue());
        
        LambdaQueryWrapper<Midterm> pendingWrapper = new LambdaQueryWrapper<>();
        pendingWrapper.eq(Midterm::getStatus, "pending");
        statistics.setPendingCount(midtermMapper.selectCount(pendingWrapper).intValue());
        
        LambdaQueryWrapper<Midterm> approvedWrapper = new LambdaQueryWrapper<>();
        approvedWrapper.eq(Midterm::getStatus, "approved");
        statistics.setApprovedCount(midtermMapper.selectCount(approvedWrapper).intValue());
        
        LambdaQueryWrapper<Midterm> rejectedWrapper = new LambdaQueryWrapper<>();
        rejectedWrapper.eq(Midterm::getStatus, "rejected");
        statistics.setRejectedCount(midtermMapper.selectCount(rejectedWrapper).intValue());
        
        return statistics;
    }
    
    @Override
    @Transactional
    public Long create(MidtermCreateDTO dto) {
        Midterm midterm = new Midterm();
        BeanUtils.copyProperties(dto, midterm);
        midterm.setStatus("draft");
        midterm.setCreateTime(LocalDateTime.now());
        midterm.setUpdateTime(LocalDateTime.now());
        
        midtermMapper.insert(midterm);
        return midterm.getId();
    }
    
    @Override
    @Transactional
    public void update(Long id, MidtermUpdateDTO dto) {
        Midterm midterm = midtermMapper.selectById(id);
        if (midterm == null) {
            throw new RuntimeException("中期检查不存在");
        }
        
        if (!"draft".equals(midterm.getStatus()) && !"rejected".equals(midterm.getStatus())) {
            throw new RuntimeException("当前状态不允许修改");
        }
        
        BeanUtils.copyProperties(dto, midterm);
        midterm.setUpdateTime(LocalDateTime.now());
        midtermMapper.updateById(midterm);
    }
    
    @Override
    @Transactional
    public void submit(Long id) {
        Midterm midterm = midtermMapper.selectById(id);
        if (midterm == null) {
            throw new RuntimeException("中期检查不存在");
        }
        
        if (!"draft".equals(midterm.getStatus()) && !"rejected".equals(midterm.getStatus())) {
            throw new RuntimeException("当前状态不允许提交");
        }
        
        midterm.setStatus("pending");
        midterm.setSubmitTime(LocalDateTime.now());
        midterm.setUpdateTime(LocalDateTime.now());
        midtermMapper.updateById(midterm);
        
        todoGeneratorService.generateMidtermReviewTodo(midterm);
    }
    
    @Override
    @Transactional
    public void withdraw(Long id) {
        Midterm midterm = midtermMapper.selectById(id);
        if (midterm == null) {
            throw new RuntimeException("中期检查不存在");
        }
        
        if (!"pending".equals(midterm.getStatus())) {
            throw new RuntimeException("当前状态不允许撤回");
        }
        
        midterm.setStatus("draft");
        midterm.setUpdateTime(LocalDateTime.now());
        midtermMapper.updateById(midterm);
    }
    
    @Override
    @Transactional
    public void approve(Long id, String comment) {
        Midterm midterm = midtermMapper.selectById(id);
        if (midterm == null) {
            throw new RuntimeException("中期检查不存在");
        }
        
        if (!"pending".equals(midterm.getStatus())) {
            throw new RuntimeException("当前状态不允许审核");
        }
        
        midterm.setStatus("approved");
        midterm.setAuditComment(comment);
        midterm.setAuditTime(LocalDateTime.now());
        midterm.setUpdateTime(LocalDateTime.now());
        midtermMapper.updateById(midterm);
    }
    
    @Override
    @Transactional
    public void reject(Long id, String reason) {
        Midterm midterm = midtermMapper.selectById(id);
        if (midterm == null) {
            throw new RuntimeException("中期检查不存在");
        }
        
        if (!"pending".equals(midterm.getStatus())) {
            throw new RuntimeException("当前状态不允许驳回");
        }
        
        midterm.setStatus("rejected");
        midterm.setAuditComment(reason);
        midterm.setAuditTime(LocalDateTime.now());
        midterm.setUpdateTime(LocalDateTime.now());
        midtermMapper.updateById(midterm);
    }
    
    @Override
    @Transactional
    public void sendNotice(MidtermNoticeDTO dto) {
        if (dto.getProjectIds() == null || dto.getProjectIds().isEmpty()) {
            throw new RuntimeException("通知项目列表不能为空");
        }
        
        // 为每个项目创建中期检查记录
        for (Long projectId : dto.getProjectIds()) {
            // 创建新的中期检查记录
            Midterm midterm = new Midterm();
            midterm.setProjectId(projectId);
            midterm.setStatus("draft");
            midterm.setCreateTime(LocalDateTime.now());
            midterm.setUpdateTime(LocalDateTime.now());
            midtermMapper.insert(midterm);
            
            todoGeneratorService.generateMidtermSubmitTodo(midterm);
        }
        
        // 可扩展：发送通知消息/邮件给项目负责人
    }
    
    @Override
    @Transactional
    public AttachmentDTO uploadAttachment(Long id, MultipartFile file, String type) {
        Midterm midterm = midtermMapper.selectById(id);
        if (midterm == null) {
            throw new RuntimeException("中期检查不存在");
        }
        
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }
        
        // 创建附件记录
        AttachmentDTO dto = new AttachmentDTO();
        dto.setName(file.getOriginalFilename());
        dto.setSize(file.getSize());
        dto.setType(type);
        dto.setEntityType("midterm");
        dto.setEntityId(id);
        dto.setUploadTime(LocalDateTime.now());
        
        // 实际场景需要：
        // 1. 调用文件服务保存文件
        // 2. 生成文件访问URL
        // 3. 保存附件记录到数据库
        // dto.setUrl(fileService.upload(file));
        // dto.setId(attachmentMapper.insert(dto));
        
        return dto;
    }
    
    @Override
    public String export(Long id) {
        Midterm midterm = midtermMapper.selectById(id);
        if (midterm == null) {
            throw new RuntimeException("中期检查不存在");
        }
        
        // 1. Generate Word/PDF using Apache POI/iText
        // 2. Upload to file server
        // 3. Return download URL
        String filename = "midterm_" + midterm.getProjectNo() + "_" + System.currentTimeMillis() + ".pdf";
        return "/exports/midterm/" + filename;
    }
}
