package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 专家评审数据传输对象 - 完全匹配ExpertReview实体
 */
@Data
public class ExpertReviewDTO {
    
    private Long id;
    
    private String reviewNo;
    
    private String projectNo;
    
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    private String projectName;
    
    private Long expertId;
    
    private String expertName;
    
    private String reviewType;
    
    private String reviewMethod;
    
    private BigDecimal innovationScore;
    
    private BigDecimal feasibilityScore;
    
    private BigDecimal applicationScore;
    
    private BigDecimal comprehensiveScore;
    
    private String reviewComment;
    
    private String reviewStatus;
    
    private LocalDate reviewDeadline;
    
    private String status;
    
    private String auditStatus;
    
    private String auditComment;
    
    private LocalDateTime auditTime;
    
    private LocalDateTime submitTime;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
    
    private Long createBy;
    
    private Long updateBy;
    
    private Integer deleted;
}
