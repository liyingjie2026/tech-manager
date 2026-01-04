package com.research.project.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 专家评审结果DTO
 */
@Data
public class ExpertReviewResultDTO {
    private Long id;
    private Long reviewId;
    private Long projectId;
    private String projectName;
    private Long expertId;
    private String expertName;
    private BigDecimal score;
    private String grade;
    private String comment;
    private LocalDateTime reviewTime;
    private String status;
    private List<ExpertResult> expertResults;
    private Double averageScore;
    private String conclusion;
    private Boolean passed;

    @Data
    public static class ExpertResult {
        private Long id;
        private Long expertId;
        private String expertName;
        private Integer score;
        private String grade;
        private String comment;
        private String opinion;
        private String submitTime;
        private LocalDateTime reviewTime;
        private String status;
    }
}
