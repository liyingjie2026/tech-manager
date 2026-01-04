package com.research.project.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 评审详情DTO
 */
@Data
public class ReviewDetailDTO {
    private Long id;
    private Long projectId;
    private String projectName;
    private String reviewType;
    private String reviewStage;
    private LocalDate reviewDate;
    private List<ExpertDTO> experts;
    private List<ExpertScoreDTO> scores;
    private String reviewStatus;
    private Double averageScore;
    private String conclusion;
    private String summary;
    
    public void setStatus(String status) {
        this.reviewStatus = status;
    }
    
    public String getStatus() {
        return this.reviewStatus;
    }
    
    public void setCreateTime(LocalDateTime createTime) {
        // Map createTime to reviewDate (converting LocalDateTime to LocalDate)
        if (createTime != null) {
            this.reviewDate = createTime.toLocalDate();
        }
    }
    
    public LocalDateTime getCreateTime() {
        // Convert reviewDate back to LocalDateTime if needed
        return reviewDate != null ? reviewDate.atStartOfDay() : null;
    }
}
