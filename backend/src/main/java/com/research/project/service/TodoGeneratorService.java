package com.research.project.service;

import com.research.project.entity.*;

/**
 * 待办事项自动生成服务
 */
public interface TodoGeneratorService {
    
    /**
     * 项目提交后生成待办（专家评审）
     */
    void generateProjectReviewTodo(Project project);
    
    /**
     * 任务书提交后生成待办（机构/监管审核）
     */
    void generateTaskBookAuditTodo(TaskBook taskBook);
    
    /**
     * 任务书审批后生成待办（科研机构审核）
     */
    void generateTaskBookApproveTodo(TaskBook taskBook);
    
    /**
     * 任务书签订后生成待办（各方签订）
     */
    void generateTaskBookSignTodo(TaskBook taskBook);
    
    /**
     * 项目变更提交后生成待办（机构/监管审核）
     */
    void generateChangeAuditTodo(Change change);
    
    /**
     * 项目变更审核待办
     */
    void generateChangeReviewTodo(Change change);
    
    /**
     * 中期检查提交后生成待办（机构/监管审核）
     */
    void generateMidtermReviewTodo(Midterm midterm);
    
    /**
     * 中期检查提交待办
     */
    void generateMidtermSubmitTodo(Midterm midterm);
    
    /**
     * 年报检查提交后生成待办（机构/监管审核）
     */
    void generateAnnualReviewTodo(Long projectId, Integer year);
    
    /**
     * 年报提交待办
     */
    void generateAnnualSubmitTodo(Annual annual);
    
    /**
     * 验收提交后生成待办（监管审核）
     */
    void generateAcceptanceReviewTodo(Acceptance acceptance);
    
    /**
     * 专家入库申请后生成待办（监管审核）
     */
    void generateExpertAuditTodo(Expert expert);
    
    /**
     * 机构入库申请后生成待办（监管审核）
     */
    void generateInstitutionAuditTodo(Institution institution);
    
    /**
     * 成果提交后生成待办（监管审核）
     */
    void generateAchievementAuditTodo(Achievement achievement);
    
    /**
     * 资源共享申请后生成待办（监管审核）
     */
    void generateResourceAuditTodo(com.research.project.entity.Resource resource);
}
