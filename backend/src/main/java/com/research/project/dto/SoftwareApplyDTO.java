package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 软件申请DTO
 */
@Data
public class SoftwareApplyDTO {
    @NotBlank(message = "申请原因不能为空")
    private String reason;
    
    private String usagePeriod;
}
