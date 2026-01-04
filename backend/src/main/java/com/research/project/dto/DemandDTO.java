package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 需求数据传输对象
 */
@Data
public class DemandDTO {
    
    private Long id;
    
    /** 需求编号 */
    private String demandNo;
    
    /** 需求名称 */
    @NotBlank(message = "需求名称不能为空")
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
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private String auditBy;
    
    /** 发布时间 */
    private LocalDateTime publishTime;
    
    /** 创建时间 */
    private LocalDateTime createTime;
    
    /** 更新时间 */
    private LocalDateTime updateTime;
    
    /** 创建人 */
    private Long createBy;
    
    /** 更新人 */
    private Long updateBy;
}
