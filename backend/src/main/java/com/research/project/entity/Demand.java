package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 需求实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_demand")
public class Demand extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 需求编号 */
    private String demandNo;
    
    /** 需求名称 */
    private String name;
    
    /** 需求类型 */
    private String type;
    
    /** 项目类型 */
    private String projectType;
    
    /** 研究领域 */
    private String researchField;
    
    /** 需求描述 */
    private String description;
    
    /** 研究目标 */
    private String objective;
    
    /** 研究内容 */
    private String content;
    
    /** 预期成果 */
    private String expectedResult;
    
    /** 预算金额（万元） */
    private BigDecimal budget;
    
    /** 申报开始日期 */
    private String applyStartDate;
    
    /** 申报截止日期 */
    private String applyEndDate;
    
    /** 执行周期（月） */
    private Integer duration;
    
    /** 发布单位 */
    private String publishUnit;
    
    /** 联系人 */
    private String contactPerson;
    
    /** 联系电话 */
    private String contactPhone;
    
    /** 附件 */
    private String attachments;
    
    /** 状态：draft-草稿 published-已发布 closed-已关闭 */
    private String status;
    
    /** 审核状态：pending-待审核 approved-已通过 rejected-已驳回 */
    private String auditStatus;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 审核时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private String auditBy;
    
    /** 发布时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime publishTime;
}
