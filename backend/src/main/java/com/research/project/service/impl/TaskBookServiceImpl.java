package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.research.project.common.PageResult;
import com.research.project.dto.*;
import com.research.project.entity.Project;
import com.research.project.entity.TaskBook;
import com.research.project.mapper.ProjectMapper;
import com.research.project.mapper.TaskBookMapper;
import com.research.project.service.ProjectService;
import com.research.project.service.TaskBookService;
import com.research.project.service.TodoGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 任务书服务实现类
 */
@Service
@RequiredArgsConstructor
public class TaskBookServiceImpl extends ServiceImpl<TaskBookMapper, TaskBook> implements TaskBookService {
    
    private final ProjectMapper projectMapper;
    private final ProjectService projectService;
    private final TodoGeneratorService todoGeneratorService;
    
    @Override
    public PageResult<TaskBookDTO> list(Integer current, Integer size, String projectName, String projectNo, String status) {
        Page<TaskBook> pageParam = new Page<>(current, size);
        LambdaQueryWrapper<TaskBook> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(projectName)) {
            wrapper.like(TaskBook::getProjectName, projectName);
        }
        if (StringUtils.hasText(projectNo)) {
            wrapper.like(TaskBook::getProjectNo, projectNo);
        }
        if (StringUtils.hasText(status)) {
            wrapper.eq(TaskBook::getSignStatus, status);
        }
        wrapper.orderByDesc(TaskBook::getCreateTime);
        
        IPage<TaskBook> pageResult = baseMapper.selectPage(pageParam, wrapper);
        
        List<TaskBookDTO> dtoList = new ArrayList<>();
        pageResult.getRecords().forEach(taskBook -> {
            TaskBookDTO dto = convertToDTO(taskBook);
            dtoList.add(dto);
        });
        
        return new PageResult<>(current.longValue(), size.longValue(), pageResult.getTotal(), dtoList);
    }
    
    private TaskBookDTO convertToDTO(TaskBook taskBook) {
        TaskBookDTO dto = new TaskBookDTO();
        dto.setId(taskBook.getId());
        dto.setProjectId(taskBook.getProjectId());
        dto.setTaskBookNo(taskBook.getTaskBookNo());
        dto.setProjectNo(taskBook.getProjectNo());
        dto.setProjectName(taskBook.getProjectName());
        dto.setProjectType(taskBook.getProjectType());
        dto.setInstitutionId(taskBook.getInstitutionId());
        dto.setInstitutionName(taskBook.getInstitutionName());
        dto.setProjectLeader(taskBook.getProjectLeader());
        dto.setLeaderPhone(taskBook.getLeaderPhone());
        dto.setStartDate(taskBook.getStartDate());
        dto.setEndDate(taskBook.getEndDate());
        dto.setTotalBudget(taskBook.getTotalBudget());
        dto.setSignStatus(taskBook.getSignStatus());
        dto.setStatus(taskBook.getStatus());
        dto.setTaskBookUploaded(StringUtils.hasText(taskBook.getTaskBookFile()) || StringUtils.hasText(taskBook.getSealedFile()));
        dto.setSubmitTime(taskBook.getSubmitTime());
        dto.setSignTime(taskBook.getSignTime());
        return dto;
    }
    
    @Override
    public TaskBookDetailDTO getById(Long id) {
        TaskBook taskBook = baseMapper.selectById(id);
        if (taskBook == null) {
            throw new RuntimeException("任务书不存在");
        }
        
        TaskBookDetailDTO dto = new TaskBookDetailDTO();
        org.springframework.beans.BeanUtils.copyProperties(taskBook, dto);
        return dto;
    }
    
    @Override
    public TaskBookStatisticsDTO getStatistics() {
        TaskBookStatisticsDTO dto = new TaskBookStatisticsDTO();
        dto.setTotalCount(baseMapper.selectCount(null).intValue());
        dto.setDraftCount(0);
        dto.setPendingCount(0);
        dto.setApprovedCount(0);
        return dto;
    }
    
    @Override
    @Transactional
    public void saveDraft(Long id, TaskBookSaveDTO dto) {
        TaskBook taskBook = baseMapper.selectById(id);
        if (taskBook == null) {
            throw new RuntimeException("任务书不存在");
        }
        org.springframework.beans.BeanUtils.copyProperties(dto, taskBook);
        baseMapper.updateById(taskBook);
    }
    
    @Override
    public String export(Long id, String format) {
        return "export-url";
    }
    
    @Override
    @Transactional
    public void uploadSigned(Long id, MultipartFile file) {
        TaskBook taskBook = baseMapper.selectById(id);
        if (taskBook == null) {
            throw new RuntimeException("任务书不存在");
        }
        
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }
        
        // 实际场景需要：
        // 1. 上传盖章文件到文件服务器
        // 2. 保存文件URL到任务书
        // String fileUrl = fileService.upload(file);
        // taskBook.setSealedFile(fileUrl);
        
        // 临时实现：保存文件名
        taskBook.setSealedFile(file.getOriginalFilename());
        taskBook.setUpdateTime(LocalDateTime.now());
        baseMapper.updateById(taskBook);
    }
    
    /**
     * 科研机构端提交任务书
     */
    @Override
    @Transactional
    public void submit(Long id) {
        TaskBook taskBook = baseMapper.selectById(id);
        if (taskBook == null) {
            throw new RuntimeException("任务书不存在");
        }
        
        taskBook.setStatus("pending"); // 待审核
        taskBook.setSignStatus("processing"); // 流程中
        taskBook.setSubmitTime(LocalDateTime.now());
        baseMapper.updateById(taskBook);
        
        todoGeneratorService.generateTaskBookApproveTodo(taskBook);
    }
    
    /**
     * 监管端审核通过任务书
     */
    @Override
    @Transactional
    public void approve(Long id, TaskBookApproveDTO dto) {
        TaskBook taskBook = baseMapper.selectById(id);
        if (taskBook == null) {
            throw new RuntimeException("任务书不存在");
        }
        
        taskBook.setStatus("approved"); // 审核通过
        taskBook.setSignStatus("signed"); // 已签订
        taskBook.setAuditComment(dto != null ? dto.getComment() : null);
        taskBook.setAuditTime(LocalDateTime.now());
        taskBook.setSignTime(LocalDateTime.now());
        
        if (dto != null) {
            taskBook.setNeedMidterm(dto.getNeedMidterm());
            taskBook.setNeedAnnual(dto.getNeedAnnual());
            taskBook.setMidtermDate(dto.getMidtermDate());
            taskBook.setAnnualDate(dto.getAnnualDate());
        }
        
        baseMapper.updateById(taskBook);
        
        Long projectId = taskBook.getProjectId();
        if (projectId != null) {
            Project project = projectMapper.selectById(projectId);
            if (project != null) {
                projectService.updateWorkflowStage(projectId, "research");
            }
        }
    }
    
    /**
     * 撤回任务书
     */

    @Transactional
    public void withdraw(Long id) {
        TaskBook taskBook = baseMapper.selectById(id);
        if (taskBook == null) {
            throw new RuntimeException("任务书不存在");
        }
        
        taskBook.setStatus("to_submit"); // 待提交
        taskBook.setSignStatus("pending"); // 待签订
        baseMapper.updateById(taskBook);
    }
    
    @Override
    public List<TaskItemDTO> getTasks(Long id) {
        return new ArrayList<>();
    }
    
    @Override
    @Transactional
    public Long addTask(Long id, TaskItemCreateDTO dto) {
        // In real implementation, create task and return its ID
        return id; // Temporarily return taskbook id, should be task id
    }
    
    @Override
    @Transactional
    public void updateTask(Long id, Long taskId, TaskItemUpdateDTO dto) {
    }
    
    @Override
    @Transactional
    public void deleteTask(Long id, Long taskId) {
    }
    
    @Override
    @Transactional
    public void batchDeleteTasks(Long id, List<Long> taskIds) {
    }
    
    @Override
    @Transactional
    public void saveMidtermConfig(Long id, MidtermConfigDTO dto) {
    }
    
    @Override
    public MidtermConfigDTO getMidtermConfig(Long id) {
        return new MidtermConfigDTO();
    }
    
    @Override
    @Transactional
    public void reject(Long id, String reason) {
        TaskBook taskBook = baseMapper.selectById(id);
        if (taskBook == null) {
            throw new RuntimeException("任务书不存在");
        }
        
        taskBook.setStatus("rejected"); // 已驳回
        taskBook.setSignStatus("pending"); // 回到待签订
        taskBook.setAuditComment(reason);
        taskBook.setAuditTime(LocalDateTime.now());
        baseMapper.updateById(taskBook);
    }
    
    @Override
    @Transactional
    public void returnForModification(Long id, String reason) {
        TaskBook taskBook = baseMapper.selectById(id);
        if (taskBook == null) {
            throw new RuntimeException("任务书不存在");
        }
        
        taskBook.setStatus("to_submit"); // 退回待提交
        taskBook.setSignStatus("pending"); // 待签订
        taskBook.setAuditComment(reason);
        taskBook.setAuditTime(LocalDateTime.now());
        baseMapper.updateById(taskBook);
    }
}
