package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 中期检查详情DTO
 */
@Data
public class MidtermDetailDTO {
    private Long id;
    private String midtermNo;
    private Long projectId;
    private String projectNo;
    private String projectName;
    private String institutionName;
    private String projectLeader;
    private String checkYear;
    private Integer planProgress;
    private Integer actualProgress;
    private BigDecimal usedBudget;
    private String progressDesc;
    private String problems;
    private String nextPlan;
    private String achievements;
    private List<AttachmentDTO> attachments;
    private String status;
    private String auditComment;
    private LocalDateTime auditTime;
    private String auditBy;
    private LocalDateTime submitTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Long createBy;
    private Long updateBy;
}
