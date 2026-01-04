package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 任务书实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_task_book")
public class TaskBook extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 任务书编号 */
    private String taskBookNo;
    
    /** 项目ID */
    private Long projectId;
    
    /** 项目编号 */
    private String projectNo;
    
    /** 项目名称 */
    private String projectName;
    
    /** 项目类型 */
    private String projectType;
    
    /** 承担单位ID */
    private Long institutionId;
    
    /** 承担单位名称 */
    private String institutionName;
    
    /** 项目负责人 */
    private String projectLeader;
    
    /** 负责人电话 */
    private String leaderPhone;
    
    /** 项目开始时间 */
    private LocalDate startDate;
    
    /** 项目结束时间 */
    private LocalDate endDate;
    
    /** 项目总预算（万元） */
    private BigDecimal totalBudget;
    
    /** 申请经费（万元） */
    private BigDecimal applyBudget;
    
    /** 自筹经费（万元） */
    private BigDecimal selfBudget;
    
    /** 研究目标 */
    private String objective;
    
    /** 研究内容 */
    private String content;
    
    /** 预期成果 */
    private String expectedResult;
    
    /** 考核指标 */
    private String indicators;
    
    /** 任务书文件 */
    private String taskBookFile;
    
    /** 盖章文件 */
    private String sealedFile;
    
    /** 是否需要中期检查：0-否 1-是 */
    private Integer needMidterm;
    
    /** 中期检查时间 */
    private String midtermDate;
    
    /** 是否需要年度检查：0-否 1-是 */
    private Integer needAnnual;
    
    /** 年度检查时间 */
    private String annualDate;
    
    /** 签订状态：pending-待签订 processing-流程中 signed-已签订 */
    private String signStatus;
    
    /** 审核状态：to_submit-待提交 pending-待审核 approved-审核通过 rejected-已驳回 */
    private String status;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 审核时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private String auditBy;
    
    /** 签订时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime signTime;
    
    /** 提交时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime submitTime;
}
