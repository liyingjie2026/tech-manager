package com.research.project.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.research.project.dto.*;
import com.research.project.entity.Project;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 项目服务接口
 */
public interface ProjectService extends IService<Project> {
    
    
    /**
     * 获取我的项目列表
     */
    Page<Project> getMyProjects(Long current, Long size, String status);
    
    /**
     * 提交项目申报
     */
    void submitProject(Long id);
    
    /**
     * 撤回项目申报
     */
    void withdrawProject(Long id);
    
    /**
     * 项目审核通过
     */
    void approveProject(Long id, String comment);
    
    /**
     * 立项评审通过
     */
    void preliminaryReviewPass(Long id, String comment);
    
    /**
     * 立项评审未通过
     */
    void preliminaryReviewFail(Long id, String reason);
    
    /**
     * 项目审核驳回
     */
    void rejectProject(Long id, String reason);
    
    /**
     * 项目退回修改
     */
    void returnProject(Long id, String reason);
    
    /**
     * 批量审核通过
     */
    void batchApprove(List<Long> ids);
    
    /**
     * 批量审核驳回
     */
    void batchReject(List<Long> ids, String reason);
    
    /**
     * 添加项目成员
     */
    void addMember(Long id, ProjectMemberDTO dto);
    
    /**
     * 移除项目成员
     */
    void removeMember(Long id, Long memberId);
    
    /**
     * 更新项目成员
     */
    void updateMember(Long id, Long memberId, ProjectMemberDTO dto);
    
    /**
     * 保存项目预算
     */
    void saveBudget(Long id, ProjectBudgetDTO dto);
    
    /**
     * 获取项目预算
     */
    ProjectBudgetDTO getBudget(Long id);
    
    /**
     * 上传项目附件
     */
    AttachmentDTO uploadAttachment(Long id, MultipartFile file, String type);
    
    /**
     * 删除项目附件
     */
    void deleteAttachment(Long id, Long attachmentId);
    
    /**
     * 下载项目附件
     */
    String downloadAttachment(Long id, Long attachmentId);
    
    /**
     * 保存实施进度计划
     */
    void saveSchedule(Long id, List<ProjectScheduleDTO> schedules);
    
    /**
     * 添加进度计划项
     */
    Long addScheduleItem(Long id, ProjectScheduleDTO dto);
    
    /**
     * 删除进度计划项
     */
    void deleteScheduleItem(Long id, Long scheduleId);
    
    /**
     * 保存绩效指标
     */
    void savePerformance(Long id, ProjectPerformanceDTO dto);
    
    /**
     * 导出项目申报书PDF
     */
    String exportPdf(Long id);
    
    /**
     * 导出项目申报书Word
     */
    String exportWord(Long id);
    
    /**
     * 导出项目列表Excel
     */
    String exportExcel(String keyword, String projectType, String status);
    
    /**
     * 项目查重
     */
    DuplicateCheckResultDTO duplicateCheck(Long id);
    
    /**
     * 获取查重结果
     */
    DuplicateCheckResultDTO getDuplicateCheckResult(Long id);
    
    /**
     * 获取项目统计数据
     */
    ProjectStatisticsDTO getStatistics();
    
    /**
     * 获取项目工作流状态
     */
    WorkflowStatusDTO getWorkflowStatus(Long id);
    
    /**
     * 更新项目工作流阶段
     */
    void updateWorkflowStage(Long id, String stage);
    
    /**
     * 获取工作流历史记录
     */
    List<WorkflowHistoryDTO> getWorkflowHistory(Long id);
    
    /**
     * 监管端下发任务书
     */
    void issueTaskBook(Long projectId, TaskBookIssueDTO dto);
}
