package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 评分项DTO
 */
@Data
public class ScoreItemDTO {
    
    private String itemName;
    
    private BigDecimal maxScore;
    
    private BigDecimal score;
    
    private String comment;
}
