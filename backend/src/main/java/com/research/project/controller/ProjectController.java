package com.research.project.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.entity.Project;
import com.research.project.service.ProjectService;
import com.research.project.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 项目管理控制器
 * 页面：科研机构端 - 项目管理 - 项目申报/我的项目
 *       监测监管端 - 项目管理 - 申报管理/项目台账
 */
@Tag(name = "项目管理", description = "项目申报、审核、查询等接口")
@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // ==================== 项目列表查询 ====================

    /**
     * 分页查询项目列表
     * 按钮：项目台账页面/申报管理页面 - 查询按钮
     */
    @Operation(summary = "分页查询项目列表")
    @GetMapping
    public Result<Page<Project>> list(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String projectName,
            @RequestParam(required = false) String projectNo,
            @RequestParam(required = false) String projectType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long institutionId,
            @RequestParam(required = false) String leaderName,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        Page<Project> page = new Page<>(current, size);
        QueryWrapper<Project> queryWrapper = new QueryWrapper<>();
        
        queryWrapper.eq("deleted", 0);
        
        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.and(w -> w.like("name", keyword)
                    .or().like("project_no", keyword));
        }
        if (projectName != null && !projectName.isEmpty()) {
            queryWrapper.like("name", projectName);
        }
        if (projectNo != null && !projectNo.isEmpty()) {
            queryWrapper.like("project_no", projectNo);
        }
        if (projectType != null && !projectType.isEmpty()) {
            queryWrapper.eq("project_type", projectType);
        }
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq("status", status);
        }
        if (institutionId != null) {
            queryWrapper.eq("institution_id", institutionId);
        }
        if (leaderName != null && !leaderName.isEmpty()) {
            queryWrapper.like("leader_name", leaderName);
        }
        if (year != null && !year.isEmpty()) {
            queryWrapper.apply("YEAR(start_date) = {0}", year);
        }
        if (startDate != null && !startDate.isEmpty()) {
            queryWrapper.ge("start_date", startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            queryWrapper.le("end_date", endDate);
        }
        
        queryWrapper.orderByDesc("create_time");
        Page<Project> result = projectService.page(page, queryWrapper);
        
        return Result.success(result);
    }

    /**
     * 获取我的项目列表
     * 按钮：我的项目页面 - 加载数据
     */
    @Operation(summary = "获取我的项目列表")
    @GetMapping("/my")
    public Result<Page<Project>> myProjects(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String status) {
        return Result.success(projectService.getMyProjects(current, size, status));
    }

    /**
     * 获取项目详情
     * 按钮：项目列表页面 - 详情按钮
     */
    @Operation(summary = "获取项目详情")
    @GetMapping("/{id}")
    public Result<Project> getById(@PathVariable Long id) {
        Project project = projectService.getById(id);
        if (project == null) {
            return Result.error("项目不存在");
        }
        return Result.success(project);
    }

    // ==================== 项目申报 ====================

    /**
     * 创建项目申报（保存草稿）
     * 按钮：项目申报页面 - 保存草稿按钮
     */
    @Operation(summary = "创建项目申报（保存草稿）")
    @PostMapping("/draft")
    public Result<Long> saveDraft(@Valid @RequestBody Project project) {
        if (project.getProjectNo() == null || project.getProjectNo().isEmpty()) {
            project.setProjectNo(generateProjectNo());
        }
        project.setStatus("draft");
        
        // Get current user ID from SecurityContext
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId != null) {
            project.setCreateBy(userId);
            project.setUpdateBy(userId);
        }
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        project.setCreateTime(now);
        project.setUpdateTime(now);
        
        projectService.save(project);
        return Result.success(project.getId());
    }

    /**
     * 更新项目申报草稿
     * 按钮：项目申报页面 - 保存按钮
     */
    @Operation(summary = "更新项目申报草稿")
    @PutMapping("/{id}/draft")
    public Result<Void> updateDraft(@PathVariable Long id, @Valid @RequestBody Project project) {
        project.setId(id);
        projectService.updateById(project);
        return Result.success();
    }

    /**
     * 提交项目申报
     * 按钮：项目申报页面 - 提交申报按钮
     */
    @Operation(summary = "提交项目申报")
    @PostMapping("/{id}/submit")
    public Result<Void> submit(@PathVariable Long id) {
        projectService.submitProject(id);
        return Result.success();
    }

    /**
     * 撤回项目申报
     * 按钮：我的项目页面 - 撤回按钮
     */
    @Operation(summary = "撤回项目申报")
    @PostMapping("/{id}/withdraw")
    public Result<Void> withdraw(@PathVariable Long id) {
        projectService.withdrawProject(id);
        return Result.success();
    }

    /**
     * 删除项目申报（草稿）
     * 按钮：我的项目页面 - 删除按钮
     */
    @Operation(summary = "删除项目申报")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        projectService.removeById(id);
        return Result.success();
    }

    // ==================== 项目审核 ====================

    /**
     * 项目审核通过
     * 按钮：申报管理详情页面 - 通过按钮
     */
    @Operation(summary = "项目审核通过")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id, @RequestBody(required = false) ApproveDTO dto) {
        String comment = dto != null ? dto.getComment() : null;
        projectService.approveProject(id, comment);
        return Result.success();
    }
    
    /**
     * 立项评审通过
     * 按钮：立项评审页面 - 评审通过按钮
     */
    @Operation(summary = "立项评审通过")
    @PostMapping("/{id}/preliminary-review/pass")
    public Result<Void> preliminaryReviewPass(@PathVariable Long id, @RequestBody(required = false) String comment) {
        projectService.preliminaryReviewPass(id, comment);
        return Result.success();
    }
    
    /**
     * 立项评审未通过
     * 按钮：立项评审页面 - 评审未通过按钮
     */
    @Operation(summary = "立项评审未通过")
    @PostMapping("/{id}/preliminary-review/fail")
    public Result<Void> preliminaryReviewFail(@PathVariable Long id, @RequestBody RejectDTO dto) {
        projectService.preliminaryReviewFail(id, dto.getReason());
        return Result.success();
    }

    /**
     * 项目审核驳回
     * 按钮：申报管理详情页面 - 驳回按钮
     */
    @Operation(summary = "项目审核驳回")
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @RequestBody RejectDTO dto) {
        projectService.rejectProject(id, dto.getReason());
        return Result.success();
    }

    /**
     * 项目退回修改
     * 按钮：申报管理详情页面 - 退回修改按钮
     */
    @Operation(summary = "项目退回修改")
    @PostMapping("/{id}/return")
    public Result<Void> returnForModification(@PathVariable Long id, @RequestBody RejectDTO dto) {
        projectService.returnProject(id, dto.getReason());
        return Result.success();
    }

    /**
     * 批量审核通过
     * 按钮：申报管理页面 - 批量通过按钮
     */
    @Operation(summary = "批量审核通过")
    @PostMapping("/batch/approve")
    public Result<Void> batchApprove(@RequestBody List<Long> ids) {
        projectService.batchApprove(ids);
        return Result.success();
    }

    /**
     * 批量审核驳回
     * 按钮：申报管理页面 - 批量驳回按钮
     */
    @Operation(summary = "批量审核驳回")
    @PostMapping("/batch/reject")
    public Result<Void> batchReject(@RequestBody BatchRejectDTO dto) {
        projectService.batchReject(dto.getIds(), dto.getReason());
        return Result.success();
    }

    // ==================== 项目成员管理 ====================

    /**
     * 添加项目成员
     * 按钮：项目申报页面 - 成员管理Tab - 添加成员按钮
     */
    @Operation(summary = "添加项目成员")
    @PostMapping("/{id}/members")
    public Result<Void> addMember(@PathVariable Long id, @Valid @RequestBody ProjectMemberDTO dto) {
        projectService.addMember(id, dto);
        return Result.success();
    }

    /**
     * 移除项目成员
     * 按钮：项目申报页面 - 成员管理Tab - 删除按钮
     */
    @Operation(summary = "移除项目成员")
    @DeleteMapping("/{id}/members/{memberId}")
    public Result<Void> removeMember(@PathVariable Long id, @PathVariable Long memberId) {
        projectService.removeMember(id, memberId);
        return Result.success();
    }

    /**
     * 更新项目成员
     * 按钮：项目申报页面 - 成员管理Tab - 编辑按钮
     */
    @Operation(summary = "更新项目成员")
    @PutMapping("/{id}/members/{memberId}")
    public Result<Void> updateMember(
            @PathVariable Long id,
            @PathVariable Long memberId,
            @Valid @RequestBody ProjectMemberDTO dto) {
        projectService.updateMember(id, memberId, dto);
        return Result.success();
    }

    // ==================== 项目预算管理 ====================

    /**
     * 保存项目预算
     * 按钮：项目申报页面 - 预算填报Tab - 保存按钮
     */
    @Operation(summary = "保存项目预算")
    @PostMapping("/{id}/budget")
    public Result<Void> saveBudget(@PathVariable Long id, @Valid @RequestBody ProjectBudgetDTO dto) {
        projectService.saveBudget(id, dto);
        return Result.success();
    }

    /**
     * 获取项目预算
     * 按钮：项目申报页面 - 预算填报Tab - 加载数据
     */
    @Operation(summary = "获取项目预算")
    @GetMapping("/{id}/budget")
    public Result<ProjectBudgetDTO> getBudget(@PathVariable Long id) {
        return Result.success(projectService.getBudget(id));
    }

    // ==================== 项目附件管理 ====================

    /**
     * 上传项目附件
     * 按钮：项目申报页面 - 附件管理Tab - 上传按钮
     */
    @Operation(summary = "上传项目附件")
    @PostMapping("/{id}/attachments")
    public Result<AttachmentDTO> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam String type) {
        return Result.success(projectService.uploadAttachment(id, file, type));
    }

    /**
     * 删除项目附件
     * 按钮：项目申报页面 - 附件管理Tab - 删除按钮
     */
    @Operation(summary = "删除项目附件")
    @DeleteMapping("/{id}/attachments/{attachmentId}")
    public Result<Void> deleteAttachment(@PathVariable Long id, @PathVariable Long attachmentId) {
        projectService.deleteAttachment(id, attachmentId);
        return Result.success();
    }

    /**
     * 下载项目附件
     * 按钮：项目申报页面 - 附件管理Tab - 下载按钮
     */
    @Operation(summary = "下载项目附件")
    @GetMapping("/{id}/attachments/{attachmentId}/download")
    public Result<String> downloadAttachment(@PathVariable Long id, @PathVariable Long attachmentId) {
        return Result.success(projectService.downloadAttachment(id, attachmentId));
    }

    // ==================== 项目进度管理 ====================

    /**
     * 保存实施进度计划
     * 按钮：项目申报页面 - 实施进度计划Tab - 保存按钮
     */
    @Operation(summary = "保存实施进度计划")
    @PostMapping("/{id}/schedule")
    public Result<Void> saveSchedule(@PathVariable Long id, @Valid @RequestBody List<ProjectScheduleDTO> schedules) {
        projectService.saveSchedule(id, schedules);
        return Result.success();
    }

    /**
     * 添加进度计划项
     * 按钮：项目申报页面 - 实施进度计划Tab - 添加按钮
     */
    @Operation(summary = "添加进度计划项")
    @PostMapping("/{id}/schedule/item")
    public Result<Long> addScheduleItem(@PathVariable Long id, @Valid @RequestBody ProjectScheduleDTO dto) {
        return Result.success(projectService.addScheduleItem(id, dto));
    }

    /**
     * 删除进度计划项
     * 按钮：项目申报页面 - 实施进度计划Tab - 删除按钮
     */
    @Operation(summary = "删除进度计划项")
    @DeleteMapping("/{id}/schedule/{scheduleId}")
    public Result<Void> deleteScheduleItem(@PathVariable Long id, @PathVariable Long scheduleId) {
        projectService.deleteScheduleItem(id, scheduleId);
        return Result.success();
    }

    // ==================== 项目绩效指标 ====================

    /**
     * 保存绩效指标
     * 按钮：项目申报页面 - 绩效指标Tab - 保存按钮
     */
    @Operation(summary = "保存绩效指标")
    @PostMapping("/{id}/performance")
    public Result<Void> savePerformance(@PathVariable Long id, @Valid @RequestBody ProjectPerformanceDTO dto) {
        projectService.savePerformance(id, dto);
        return Result.success();
    }

    // ==================== 项目导出 ====================

    /**
     * 导出项目申报书PDF
     * 按钮：项目申报页面 - 导出PDF按钮
     */
    @Operation(summary = "导出项目申报书PDF")
    @GetMapping("/{id}/export/pdf")
    public Result<String> exportPdf(@PathVariable Long id) {
        return Result.success(projectService.exportPdf(id));
    }

    /**
     * 导出项目申报书Word
     * 按钮：项目申报页面 - 导出Word按钮
     */
    @Operation(summary = "导出项目申报书Word")
    @GetMapping("/{id}/export/word")
    public Result<String> exportWord(@PathVariable Long id) {
        return Result.success(projectService.exportWord(id));
    }

    /**
     * 导出项目列表Excel
     * 按钮：项目台账页面 - 导出按钮
     */
    @Operation(summary = "导出项目列表Excel")
    @GetMapping("/export/excel")
    public Result<String> exportExcel(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String projectType,
            @RequestParam(required = false) String status) {
        return Result.success(projectService.exportExcel(keyword, projectType, status));
    }

    // ==================== 项目查重 ====================

    /**
     * 项目查重
     * 按钮：申报管理页面 - 查重率按钮
     */
    @Operation(summary = "项目查重")
    @PostMapping("/{id}/duplicate-check")
    public Result<DuplicateCheckResultDTO> duplicateCheck(@PathVariable Long id) {
        return Result.success(projectService.duplicateCheck(id));
    }

    /**
     * 获取查重结果
     * 按钮：申报管理页面 - 查重率按钮（查看结果）
     */
    @Operation(summary = "获取查重结果")
    @GetMapping("/{id}/duplicate-check")
    public Result<DuplicateCheckResultDTO> getDuplicateCheckResult(@PathVariable Long id) {
        return Result.success(projectService.getDuplicateCheckResult(id));
    }

    // ==================== 项目统计 ====================

    /**
     * 获取项目统计数据
     * 按钮：申报管理页面 - 统计卡片
     */
    @Operation(summary = "获取项目统计数据")
    @GetMapping("/statistics")
    public Result<ProjectStatisticsDTO> getStatistics() {
        return Result.success(projectService.getStatistics());
    }

    // ==================== 项目工作流管理 ====================

    /**
     * 获取项目工作流状态
     * 按钮：项目详情页面 - 加载工作流状态
     */
    @Operation(summary = "获取项目工作流状态")
    @GetMapping("/{id}/workflow")
    public Result<WorkflowStatusDTO> getWorkflowStatus(@PathVariable Long id) {
        return Result.success(projectService.getWorkflowStatus(id));
    }

    /**
     * 更新项目工作流阶段
     * 按钮：项目管理页面 - 推进到下一阶段
     */
    @Operation(summary = "更新项目工作流阶段")
    @PutMapping("/{id}/workflow/stage")
    public Result<Void> updateWorkflowStage(
            @PathVariable Long id, 
            @RequestBody WorkflowStageUpdateDTO dto) {
        projectService.updateWorkflowStage(id, dto.getStage());
        return Result.success();
    }

    /**
     * 获取工作流历史
     * 按钮：项目详情页面 - 查看流程历史
     */
    @Operation(summary = "获取工作流历史")
    @GetMapping("/{id}/workflow/history")
    public Result<List<WorkflowHistoryDTO>> getWorkflowHistory(@PathVariable Long id) {
        return Result.success(projectService.getWorkflowHistory(id));
    }

    // ==================== 项目任务书管理 ====================

    /**
     * 监管端下发任务书
     * 按钮：立项评审页面 - 下发任务书按钮
     */
    @Operation(summary = "监管端下发任务书")
    @PostMapping("/{id}/issue-taskbook")
    public Result<Void> issueTaskBook(@PathVariable Long id, @RequestBody(required = false) TaskBookIssueDTO dto) {
        projectService.issueTaskBook(id, dto);
        return Result.success();
    }

    private String generateProjectNo() {
        String date = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String sequence = String.format("%06d", (int)(Math.random() * 1000000));
        return "PRJ" + date + sequence;
    }
}
