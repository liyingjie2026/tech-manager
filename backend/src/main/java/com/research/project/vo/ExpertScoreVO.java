package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 专家评分VO
 */
@Data
public class ExpertScoreVO {
    
    private Long id;
    
    private Long reviewId;
    
    private Long expertId;
    
    private String expertName;
    
    private String expertTitle;
    
    private String expertUnit;
    
    private List<ScoreItemVO> scores;
    
    private BigDecimal totalScore;
    
    private String opinion;
    
    private String conclusion;
    
    private String conclusionText;
    
    private LocalDateTime scoreTime;
}
