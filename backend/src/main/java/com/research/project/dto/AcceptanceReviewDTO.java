package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

/**
 * 验收评审DTO
 */
@Data
public class AcceptanceReviewDTO {
    @NotBlank(message = "验收方式不能为空")
    private String acceptanceMethod;
    
    @NotNull(message = "专家列表不能为空")
    private List<Long> expertIds;
    
    private String reviewRequirement;

    private String deadline;
}
