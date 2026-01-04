package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 评审DTO
 */
@Data
public class ReviewDTO {
    private Long id;
    private Long projectId;
    private String projectName;
    private String reviewType;
    private String reviewStage;
    private LocalDate reviewDate;
    private String reviewStatus;
    private Integer expertCount;
    private Integer submittedCount;
    private Double averageScore;
    private String conclusion;
    
    private String projectNo;
    private String projectType;
    private String projectCategory;
    private String institutionName;
    private String leaderName;
    private LocalDateTime reviewEndTime;
    private BigDecimal score;
    private String grade;
    private LocalDateTime createTime;
    
    public void setStatus(String status) {
        this.reviewStatus = status;
    }
    
    public String getStatus() {
        return this.reviewStatus;
    }
}
