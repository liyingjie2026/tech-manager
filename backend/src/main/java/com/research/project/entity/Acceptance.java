package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 项目验收实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_acceptance")
public class Acceptance extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 验收编号 */
    private String acceptanceNo;
    
    /** 项目ID */
    private Long projectId;
    
    /** 项目编号 */
    private String projectNo;
    
    /** 项目名称 */
    private String projectName;
    
    /** 承担单位 */
    private String institutionName;
    
    /** 项目负责人 */
    private String projectLeader;
    
    /** 项目开始时间 */
    private String startDate;
    
    /** 项目结束时间 */
    private String endDate;
    
    /** 项目总预算（万元） */
    private BigDecimal totalBudget;
    
    /** 实际使用经费（万元） */
    private BigDecimal usedBudget;
    
    /** 项目完成情况 */
    private String completionDesc;
    
    /** 考核指标完成情况 */
    private String indicatorCompletion;
    
    /** 主要成果 */
    private String achievements;
    
    /** 经费使用情况 */
    private String budgetUsage;
    
    /** 社会经济效益 */
    private String benefits;
    
    /** 存在问题及建议 */
    private String problems;
    
    /** 附件 */
    private String attachments;
    
    /** 验收方式：meeting-会议验收 correspondence-函评验收 */
    private String acceptanceMethod;
    
    /** 验收结论：excellent-优秀 qualified-合格 unqualified-不合格 */
    private String conclusion;
    
    /** 验收意见 */
    private String acceptanceComment;
    
    /** 验收时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime acceptanceTime;
    
    /** 验收专家组 */
    private String expertGroup;
    
    /** 状态：draft-草稿 pending-待验收 accepted-已验收 */
    private String status;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 审核时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private String auditBy;
    
    /** 提交时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime submitTime;
}
