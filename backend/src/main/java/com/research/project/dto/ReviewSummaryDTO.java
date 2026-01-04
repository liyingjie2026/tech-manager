package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 评审汇总DTO
 */
@Data
public class ReviewSummaryDTO {
    private Long reviewId;
    private String projectName;
    private Integer expertCount;
    private Integer submittedCount;
    private Double averageScore;
    private Double maxScore;
    private Double minScore;
    private List<ScoreSummary> scoreDetails;
    private String conclusion;
    
    private Integer pendingCount;      // 待评审数量
    private Integer inProgressCount;   // 评审中数量
    private Integer completedCount;    // 已完成数量
    private Integer totalCount;        // 总数量
    
    public void setTotalExperts(Integer totalExperts) {
        this.expertCount = totalExperts;
    }
    
    public Integer getTotalExperts() {
        return this.expertCount;
    }
    
    public void setCompletedCount(Integer completedCount) {
        this.submittedCount = completedCount;
    }
    
    public Integer getCompletedCount() {
        return this.submittedCount;
    }

    @Data
    public static class ScoreSummary {
        private String itemName;
        private Double averageScore;
        private Integer maxScore;
    }
}
