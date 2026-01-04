package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 中期检查实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_midterm")
public class Midterm extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 检查编号 */
    private String midtermNo;
    
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
    
    /** 计划完成进度（%） */
    private Integer planProgress;
    
    /** 实际完成进度（%） */
    private Integer actualProgress;
    
    /** 已使用经费（万元） */
    private BigDecimal usedBudget;
    
    /** 进展情况 */
    private String progressDesc;
    
    /** 存在问题 */
    private String problems;
    
    /** 下一步计划 */
    private String nextPlan;
    
    /** 阶段成果 */
    private String achievements;
    
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
}
