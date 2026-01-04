package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 专家评审打分详情DTO
 */
@Data
public class ExpertReviewScoresDTO {
    private Long reviewId;
    private String projectName;
    private Integer totalScore;
    private String reviewOpinion;
    private String conclusion;
    private List<ScoreDetail> scoreDetails;
    private String submitTime;

    @Data
    public static class ScoreDetail {
        private String itemName;
        private Integer itemScore;
        private Integer maxScore;
        private String comment;
    }
}
