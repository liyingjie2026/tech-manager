package com.research.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 专家评审提交DTO
 */
@Data
public class ExpertReviewSubmitDTO {
    @NotNull(message = "评审分数不能为空")
    private BigDecimal score;
    
    private String grade;
    
    private String comment;
    
    private Integer recommended;
    
    private List<ExpertScoreDTO> scoreDetails;
}
