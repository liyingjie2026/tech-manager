package com.research.project.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 变更详情DTO
 */
@Data
public class ChangeDetailDTO {
    private Long id;
    
    private String changeNo;
    private Long projectId;
    private String projectNo;
    private String projectName;
    private String applyUnit;
    private String applicant;
    private LocalDateTime applyTime;
    private String changeType;
    private String changeItem;
    private String changeReason;
    
    private String beforeContent;  // was: originalContent
    private String afterContent;   // was: changedContent
    private String attachments;
    private String status;
    
    private String auditComment;    // was: reviewComment
    private LocalDateTime auditTime; // was: reviewedAt
    private String auditBy;
    
    private String changeContent;
    
    private LocalDateTime submitTime;  // was: submittedAt
    
    private String reviewComment;
    private LocalDateTime reviewTime;
    
    private LocalDateTime createTime;  // was: createdAt
    private LocalDateTime updateTime;
    private Long createBy;
    private Long updateBy;
    
    private List<AttachmentDTO> attachmentList;

    private String changedContent;
    private String reason;
}
