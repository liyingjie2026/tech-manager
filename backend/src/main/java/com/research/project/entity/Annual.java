package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 年度检查实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_annual")
public class Annual extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 检查编号 */
    private String annualNo;
    
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
    
    /** 检查年度 */
    private String checkYear;
    
    /** 年度目标 */
    private String yearTarget;
    
    /** 年度完成情况 */
    private String yearCompletion;
    
    /** 计划完成进度（%） */
    private Integer planProgress;
    
    /** 实际完成进度（%） */
    private Integer actualProgress;
    
    /** 年度预算（万元） */
    private BigDecimal yearBudget;
    
    /** 已使用经费（万元） */
    private BigDecimal usedBudget;
    
    /** 经费使用说明 */
    private String budgetDesc;
    
    /** 年度成果 */
    private String achievements;
    
    /** 存在问题 */
    private String problems;
    
    /** 下一年计划 */
    private String nextPlan;
    
    /** 附件 */
    private String attachments;
    
    /** 状态：draft-草稿 pending-待审核 approved-已通过 rejected-已驳回 */
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
    

    /** 内容 */
    private String content;

    private String completedWork;

    private String annualSummary;
    

    
    public String getContent() {
        return this.content != null ? this.content : this.yearCompletion;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
}
