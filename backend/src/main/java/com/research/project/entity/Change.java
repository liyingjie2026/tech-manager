package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 项目变更实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_change")
public class Change extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 变更编号 */
    private String changeNo;
    
    /** 项目ID */
    private Long projectId;
    
    /** 项目编号 */
    private String projectNo;
    
    /** 项目名称 */
    private String projectName;
    
    /** 申请单位 */
    private String applyUnit;
    
    /** 申请人 */
    private String applicant;
    
    /** 申请时间 */
    private LocalDateTime applyTime;
    
    /** 变更类型：leader-负责人变更 member-成员变更 time-时间变更 budget-预算变更 content-内容变更 cancel-项目终止 */
    private String changeType;
    
    /** 变更事项 */
    private String changeItem;
    
    /** 变更原因 */
    private String changeReason;
    
    /** 变更前内容 */
    private String beforeContent;
    
    /** 变更后内容 */
    private String afterContent;
    
    /** 附件 */
    private String attachments;
    
    /** 状态：draft-草稿 pending-待审核 approved-已通过 rejected-已驳回 */
    private String status;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 审核时间 */
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private String auditBy;
    
    /** 变更内容 */
    private String changeContent;
    
    /** 提交时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime submitTime;
    
    /** 审核意见 */
    private String reviewComment;
    
    /** 审核时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reviewTime;
    
    public String getChangeContent() {
        return this.changeContent != null ? this.changeContent : this.changeItem;
    }
    
    public void setChangeContent(String changeContent) {
        this.changeContent = changeContent;
        this.changeItem = changeContent;
    }
    
    public LocalDateTime getSubmitTime() {
        return this.submitTime != null ? this.submitTime : this.applyTime;
    }
    
    public void setSubmitTime(LocalDateTime submitTime) {
        this.submitTime = submitTime;
        this.applyTime = submitTime;
    }
    
    public String getReviewComment() {
        return this.reviewComment != null ? this.reviewComment : this.auditComment;
    }
    
    public void setReviewComment(String reviewComment) {
        this.reviewComment = reviewComment;
        this.auditComment = reviewComment;
    }
    
    public LocalDateTime getReviewTime() {
        return this.reviewTime != null ? this.reviewTime : this.auditTime;
    }
    
    public void setReviewTime(LocalDateTime reviewTime) {
        this.reviewTime = reviewTime;
        this.auditTime = reviewTime;
    }
}
