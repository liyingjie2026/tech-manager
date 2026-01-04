package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 评分项VO
 */
@Data
public class ScoreItemVO {
    
    private String itemName;
    
    private BigDecimal maxScore;
    
    private BigDecimal score;
    
    private String comment;
}
