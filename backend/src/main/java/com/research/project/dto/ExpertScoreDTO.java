package com.research.project.dto;


import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

/**
 * 专家评分DTO
 */
@Data
public class ExpertScoreDTO {
    
    private Long id;
    
    @NotNull(message = "评审ID不能为空")
    private Long reviewId;
    
    @NotNull(message = "专家ID不能为空")
    private Long expertId;
    
    private List<ScoreItemDTO> scores;
    
    private BigDecimal totalScore;
    
    private String opinion;
    
    private String conclusion;
    
    private String remark;
}
