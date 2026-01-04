package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 专家评审实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_expert_review")
public class ExpertReview extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 评审批次号 */
    private String batchNo;
    
    /** 评审名称 */
    private String reviewName;
    
    /** 项目ID */
    private Long projectId;
    
    /** 项目名称 */
    private String projectName;
    
    /** 专家ID */
    private Long expertId;
    
    /** 专家姓名 */
    private String expertName;
    
    /** 评审类型：application-申报评审 midterm-中期评审 acceptance-验收评审 */
    private String reviewType;
    
    /** 评审方式：online-线上评审 offline-线下评审 */
    private String reviewMethod;
    
    /** 评审开始时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reviewStartTime;
    
    /** 评审截止时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reviewEndTime;
    
    /** 评审分数 */
    private BigDecimal score;
    
    /** 评审等级：A/B/C/D */
    private String grade;
    
    /** 评审意见 */
    private String comment;
    
    /** 是否推荐立项：0-否 1-是 */
    private Integer recommended;
    
    /** 评审状态：pending-待评审 reviewed-已评审待结论 completed-已完成 */
    private String status;
    
    /** 评审时间 */
    private LocalDateTime reviewTime;
    
    /** 是否回避：0-否 1-是 */
    private Integer avoided;
    
    /** 回避原因 */
    private String avoidReason;
    
    // Removed: createTime, updateTime, createBy, updateBy, deleted
}
