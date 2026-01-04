package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 创建投标DTO
 */
@Data
public class BidCreateDTO {
    @NotBlank(message = "投标方案不能为空")
    private String proposal;
    
    private String technicalScheme;
    private BigDecimal bidPrice;
    private String implementationPlan;
    private String teamIntroduction;
    private String attachments;
}
