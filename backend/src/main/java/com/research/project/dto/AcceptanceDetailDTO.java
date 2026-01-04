package com.research.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 验收详情DTO
 */
@Data
public class AcceptanceDetailDTO {
    private Long id;
    private String acceptanceNo;
    private Long projectId;
    private String projectNo;
    private String projectName;
    private String institutionName;
    private String projectLeader;
    private String startDate;
    private String endDate;
    private BigDecimal totalBudget;
    private BigDecimal usedBudget;
    private String completionDesc;
    private String indicatorCompletion;
    private String achievements;
    private String budgetUsage;
    private String benefits;
    private String problems;
    private List<AttachmentDTO> attachments;
    private String acceptanceMethod;
    private String conclusion;
    private String acceptanceComment;
    private LocalDateTime acceptanceTime;
    private String expertGroup;
    private String status;
    private String auditComment;

    private LocalDateTime auditTime;
    private String auditBy;
    private LocalDateTime submitTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private String createBy;
    private String updateBy;
}
