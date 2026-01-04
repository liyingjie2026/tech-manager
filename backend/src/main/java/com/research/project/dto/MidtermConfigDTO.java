package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 中期检查配置DTO
 */
@Data
public class MidtermConfigDTO {
    @NotBlank(message = "检查时间不能为空")
    private String checkDate;
    
    private String checkRequirements;
}
