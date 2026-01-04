package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 审核DTO
 */
@Data
public class AuditDTO {
    @NotBlank(message = "审核结果不能为空")
    private String result;
    
    private String comment;
}
