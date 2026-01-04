package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 更新中期检查DTO
 */
@Data
public class MidtermUpdateDTO {
    private String checkYear;
    private Integer planProgress;
    private Integer actualProgress;
    private BigDecimal usedBudget;
    private String progressDesc;
    private String problems;
    private String nextPlan;
    private String achievements;
    private String attachments;
}
