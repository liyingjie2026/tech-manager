package com.research.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.research.project.commonenum.StatusEnum;
import com.research.project.dto.*;
import com.research.project.entity.Project;
import com.research.project.entity.TaskBook;
import com.research.project.mapper.ProjectMapper;
import com.research.project.mapper.TaskBookMapper;
import com.research.project.service.ProjectService;
import com.research.project.service.TodoGeneratorService;
import com.research.project.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 项目服务实现类
 */
@Service
@RequiredArgsConstructor
public class ProjectServiceImpl extends ServiceImpl<ProjectMapper, Project> implements ProjectService {

    private final ProjectMapper projectMapper;
    private final TaskBookMapper taskBookMapper;
    private final TodoGeneratorService todoGeneratorService;
    
    @Override
    public Page<Project> getMyProjects(Long current, Long size, String status) {
        Long userId = SecurityUtils.getCurrentUserId();
        
        Page<Project> page = new Page<>(current, size);
        LambdaQueryWrapper<Project> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Project::getLeaderId, userId);
        queryWrapper.eq(Project::getDeleted, 0);
        
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq(Project::getStatus, status);
        }
        
        queryWrapper.orderByDesc(Project::getCreateTime);
        return this.page(page, queryWrapper);
    }
    
    @Override
    @Transactional
    public void submitProject(Long id) {
        Project project = this.getById(id);
        if (project == null) {
            throw new RuntimeException("项目不存在");
        }
        
        if (!"draft".equals(project.getStatus()) && !"returned".equals(project.getStatus())) {
            throw new RuntimeException("只有草稿或退回状态的项目可以提交");
        }
        
        Long userId = SecurityUtils.getCurrentUserId();
        Project updateProject = new Project();
        updateProject.setId(id);
        updateProject.setStatus(StatusEnum.SUBMITTED.getCode());
        updateProject.setSubmitTime(LocalDateTime.now());
        updateProject.setUpdateBy(userId);
        updateProject.setUpdateTime(LocalDateTime.now());
        this.updateById(updateProject);
        
        updateWorkflowStage(id, "review");

        todoGeneratorService.generateProjectReviewTodo(project);
    }
    
    @Override
    @Transactional
    public void withdrawProject(Long id) {
        projectMapper.updateStatus(id, StatusEnum.DRAFT.getCode());
        updateWorkflowStage(id, "application");
    }
    
    @Override
    @Transactional
    public void approveProject(Long id, String comment) {
        Long userId = SecurityUtils.getCurrentUserId();
        projectMapper.updateAuditInfo(id, StatusEnum.PRELIMINARY_APPROVED.getCode(), comment, userId, StatusEnum.PRELIMINARY_APPROVED.getCode());
        updateWorkflowStage(id, "preliminary_review");
        Project project = projectMapper.selectById(id);
        todoGeneratorService.generateProjectReviewTodo(project);
    }
    
    @Override
    @Transactional
    public void preliminaryReviewPass(Long id, String comment) {
        Long userId = SecurityUtils.getCurrentUserId();
        projectMapper.updateAuditInfo(id, StatusEnum.PRELIMINARY_REVIEW_PASSED.getCode(), comment, userId, StatusEnum.PRELIMINARY_REVIEW_PASSED.getCode());
        updateWorkflowStage(id, "expert_review");
    }
    
    @Override
    @Transactional
    public void preliminaryReviewFail(Long id, String reason) {
        Long userId = SecurityUtils.getCurrentUserId();
        projectMapper.updateAuditInfo(id, StatusEnum.PRELIMINARY_REVIEW_FAILED.getCode(), reason, userId, StatusEnum.PRELIMINARY_REVIEW_FAILED.getCode());
    }
    
    @Override
    @Transactional
    public void rejectProject(Long id, String reason) {
        Long userId = SecurityUtils.getCurrentUserId();
        projectMapper.updateAuditInfo(id, StatusEnum.REJECTED.getCode(), reason, userId, StatusEnum.REJECTED.getCode());
    }
    
    @Override
    @Transactional
    public void returnProject(Long id, String reason) {
        Long userId = SecurityUtils.getCurrentUserId();
        projectMapper.updateAuditInfo(id, StatusEnum.REJECTED.getCode(), reason, userId, StatusEnum.DRAFT.getCode());
        updateWorkflowStage(id, "application");
    }
    
    @Override
    @Transactional
    public void batchApprove(List<Long> ids) {
        Long userId = SecurityUtils.getCurrentUserId();
        projectMapper.batchUpdateStatus(ids, StatusEnum.APPROVED.getCode(), StatusEnum.APPROVED.getCode(), "批量审核通过", userId);
        ids.forEach(id -> updateWorkflowStage(id, "expert_review"));
    }
    
    @Override
    @Transactional
    public void batchReject(List<Long> ids, String reason) {
        Long userId = SecurityUtils.getCurrentUserId();
        projectMapper.batchUpdateStatus(ids, StatusEnum.REJECTED.getCode(), StatusEnum.REJECTED.getCode(), reason, userId);
    }
    
    @Override
    @Transactional
    public void addMember(Long id, ProjectMemberDTO dto) {
        Map<String, Object> member = new HashMap<>();
        member.put("projectId", id);
        member.put("userId", dto.getUserId());
        member.put("userName", dto.getName());
        member.put("role", dto.getRole());
        member.put("workUnit", dto.getWorkUnit());
        member.put("department", dto.getDepartment());
        member.put("title", dto.getTitle());
        member.put("workContent", dto.getWorkContent());
        member.put("workMonths", dto.getWorkMonths());
        member.put("sortOrder", dto.getSortOrder());
        
        projectMapper.insertMember(member);
    }
    
    @Override
    @Transactional
    public void removeMember(Long id, Long memberId) {
        projectMapper.deleteMember(memberId, id);
    }
    
    @Override
    @Transactional
    public void updateMember(Long id, Long memberId, ProjectMemberDTO dto) {
        Map<String, Object> member = new HashMap<>();
        member.put("id", memberId);
        member.put("projectId", id);
        member.put("userId", dto.getUserId());
        member.put("userName", dto.getName());
        member.put("role", dto.getRole());
        member.put("workUnit", dto.getWorkUnit());
        member.put("department", dto.getDepartment());
        member.put("title", dto.getTitle());
        member.put("workContent", dto.getWorkContent());
        member.put("workMonths", dto.getWorkMonths());
        member.put("sortOrder", dto.getSortOrder());
        projectMapper.updateMember(member);
    }
    
    @Override
    @Transactional
    public void saveBudget(Long id, ProjectBudgetDTO dto) {
        Map<String, Object> budget = new HashMap<>();
        budget.put("projectId", id);
        budget.put("category", dto.getCategory());
        budget.put("itemName", dto.getItemName());
        budget.put("applyAmount", dto.getApplyAmount());
        budget.put("selfAmount", dto.getSelfAmount());
        budget.put("description", dto.getDescription());
        
        projectMapper.insertBudget(budget);
    }
    
    @Override
    public ProjectBudgetDTO getBudget(Long id) {
        List<Object> budgets = projectMapper.selectBudgetByProjectId(id);
        // Convert budgets to ProjectBudgetDTO
        ProjectBudgetDTO budgetDTO = new ProjectBudgetDTO();
        // Assuming budgets list contains budget data that can be mapped to ProjectBudgetDTO
        // budgetDTO.setFieldsFromBudgets(budgets);
        return budgetDTO;
    }
    
    @Override
    @Transactional
    public AttachmentDTO uploadAttachment(Long id, MultipartFile file, String type) {
        Map<String, Object> attachment = new HashMap<>();
        attachment.put("project_id", id);
        attachment.put("file_name", file.getOriginalFilename());
        attachment.put("file_type", type);
        attachment.put("file_size", file.getSize());
        projectMapper.insertAttachment(attachment);
        
        AttachmentDTO attachmentDTO = new AttachmentDTO();
        attachmentDTO.setFileName(file.getOriginalFilename());
        attachmentDTO.setFileSize(file.getSize());
        attachmentDTO.setFileType(type);
        return attachmentDTO;
    }
    
    @Override
    @Transactional
    public void deleteAttachment(Long id, Long attachmentId) {
        projectMapper.deleteAttachment(attachmentId, id);
    }
    
    @Override
    public String downloadAttachment(Long id, Long attachmentId) {
        Object attachment = projectMapper.selectAttachmentById(attachmentId);
        // Assuming attachment object contains file path or URL
        // return attachment.getFilePathOrUrl();
        return "attachment-url";
    }
    
    @Override
    @Transactional
    public void saveSchedule(Long id, List<ProjectScheduleDTO> schedules) {
        projectMapper.deleteSchedulesByProjectId(id);
        
        for (ProjectScheduleDTO dto : schedules) {
            Map<String, Object> schedule = new HashMap<>();
            schedule.put("project_id", id);
            schedule.put("content", dto.getContent());
            schedule.put("start_date", dto.getStartDate());
            schedule.put("end_date", dto.getEndDate());
            projectMapper.insertSchedule(schedule);
        }
    }
    
    @Override
    @Transactional
    public Long addScheduleItem(Long id, ProjectScheduleDTO dto) {
        Map<String, Object> schedule = new HashMap<>();
        schedule.put("project_id", id);
        schedule.put("content", dto.getContent());
        schedule.put("start_date", dto.getStartDate());
        schedule.put("end_date", dto.getEndDate());
        projectMapper.insertSchedule(schedule);
        // In real implementation, get the generated ID from the insert operation
        return id; // Temporarily return project id, should be schedule id
    }
    
    @Override
    @Transactional
    public void deleteScheduleItem(Long id, Long scheduleId) {
        projectMapper.deleteSchedule(scheduleId, id);
    }
    
    @Override
    @Transactional
    public void savePerformance(Long id, ProjectPerformanceDTO dto) {
        Map<String, Object> performance = new HashMap<>();
        performance.put("projectId", id);
        performance.put("duplicateRate", 0.0);
        
        projectMapper.insertPerformance(performance);
    }
    
    @Override
    public String exportPdf(Long id) {
        return "pdf-url";
    }
    
    @Override
    public String exportWord(Long id) {
        return "word-url";
    }
    
    @Override
    public String exportExcel(String keyword, String projectType, String status) {
        return "excel-url";
    }
    
    @Override
    public DuplicateCheckResultDTO duplicateCheck(Long id) {
        double rate = Math.random() * 30;
        projectMapper.updateDuplicateRate(id, rate);
        
        DuplicateCheckResultDTO result = new DuplicateCheckResultDTO();
        result.setProjectId(id);
        result.setDuplicateRate(BigDecimal.valueOf(rate));
        result.setCheckTime(LocalDateTime.now());
        return result;
    }
    
    @Override
    public DuplicateCheckResultDTO getDuplicateCheckResult(Long id) {
        Object result = projectMapper.selectDuplicateResult(id);
        // Assuming result object contains duplicate check data that can be mapped to DuplicateCheckResultDTO
        // DuplicateCheckResultDTO dto = new DuplicateCheckResultDTO(result);
        return new DuplicateCheckResultDTO();
    }
    
    @Override
    public ProjectStatisticsDTO getStatistics() {
        Map<String, Object> stats = projectMapper.selectStatistics();
        ProjectStatisticsDTO dto = new ProjectStatisticsDTO();
        // Assuming stats map contains statistics data that can be mapped to ProjectStatisticsDTO
        // dto.setFieldsFromStats(stats);
        return dto;
    }
    
    @Override
    public WorkflowStatusDTO getWorkflowStatus(Long id) {
        Project project = this.getById(id);
        if (project == null) {
            throw new RuntimeException("项目不存在");
        }
        
        WorkflowStatusDTO dto = new WorkflowStatusDTO();
        dto.setProjectId(id);
        dto.setProjectName(project.getName());
        dto.setCurrentStage(project.getWorkflowStage() != null ? project.getWorkflowStage() : "application");
        dto.setStatus(project.getStatus());
        
        List<String> allStages = Arrays.asList(
            "demand", "market", "config", "application", "review", "preliminary_review",
            "expert_review", "taskbook_sign", "taskbook_wbs", "research", "midterm", "annual",
            "target_change", "acceptance", "achievement", "sharing"
        );
        
        String currentStage = dto.getCurrentStage();
        int currentIndex = allStages.indexOf(currentStage);
        List<String> completed = new ArrayList<>();
        if (currentIndex > 0) {
            completed = allStages.subList(0, currentIndex);
        }
        dto.setCompletedStages(completed);
        
        if (currentIndex >= 0 && currentIndex < allStages.size() - 1) {
            dto.setNextStage(allStages.get(currentIndex + 1));
        }
        
        dto.setCanProceed(StatusEnum.PRELIMINARY_APPROVED.getCode().equals(project.getAuditStatus()) || StatusEnum.DRAFT.getCode().equals(project.getStatus()));
        dto.setBlockingReason(dto.getCanProceed() ? null : "等待审核通过");
        
        return dto;
    }
    
    @Override
    @Transactional
    public void updateWorkflowStage(Long id, String stage) {
        Project project = new Project();
        project.setId(id);
        project.setWorkflowStage(stage);
        this.updateById(project);
    }
    
    @Override
    @Transactional
    public void issueTaskBook(Long projectId, TaskBookIssueDTO dto) {
        Project project = this.getById(projectId);
        if (project == null) {
            throw new RuntimeException("项目不存在");
        }
        
        // 创建任务书记录
        TaskBook taskBook = new TaskBook();
        taskBook.setProjectId(projectId);
        taskBook.setProjectNo(project.getProjectNo());
        taskBook.setProjectName(project.getName());
        taskBook.setProjectType(project.getProjectType());
        taskBook.setInstitutionId(project.getInstitutionId());
        taskBook.setInstitutionName(project.getInstitutionName());
        taskBook.setProjectLeader(project.getLeaderName());
        taskBook.setLeaderPhone(project.getLeaderPhone());
        taskBook.setStartDate(project.getStartDate());
        taskBook.setEndDate(project.getEndDate());
        taskBook.setTotalBudget(project.getTotalBudget());
        taskBook.setSignStatus("pending"); // 待签订
        taskBook.setStatus("to_submit"); // 待提交
        
        // 保存中期、年度检查配置
        if (dto != null) {
            taskBook.setNeedMidterm(dto.getNeedMidterm());
            taskBook.setMidtermDate(dto.getMidtermDate());
            taskBook.setNeedAnnual(dto.getNeedAnnual());
            taskBook.setAnnualDate(dto.getAnnualDate());
        }
        
        taskBookMapper.insert(taskBook);
        
        // 更新项目状态
        updateWorkflowStage(projectId, "taskbook_sign");
        
        todoGeneratorService.generateTaskBookSignTodo(taskBook);
    }
    
    @Override
    public List<WorkflowHistoryDTO> getWorkflowHistory(Long id) {
        List<WorkflowHistoryDTO> history = new ArrayList<>();
        
        WorkflowHistoryDTO dto = new WorkflowHistoryDTO();
        dto.setStage("application");
        dto.setStageName("项目申报");
        dto.setAction("创建");
        dto.setComment("项目创建并提交申报");
        dto.setOperatorName("系统管理员");
        dto.setOperateTime(LocalDateTime.now());
        history.add(dto);
        
        // Fetch actual workflow history from database
        // List<Object> workflowHistory = projectMapper.selectWorkflowHistory(id);
        // for (Object entry : workflowHistory) {
        //     WorkflowHistoryDTO historyDTO = new WorkflowHistoryDTO(entry);
        //     history.add(historyDTO);
        // }
        
        return history;
    }
}
