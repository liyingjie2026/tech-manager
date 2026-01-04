package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 创建需求DTO
 */
@Data
public class DemandCreateDTO {
    @NotBlank(message = "需求名称不能为空")
    private String demandName;
    
    @NotBlank(message = "需求类型不能为空")
    private String demandType;
    
    private String demandField;
    private String demandDesc;
    private String technicalRequirements;
    private BigDecimal budget;
    private String deadline;
    private String contactPerson;
    private String contactPhone;
    private String contactEmail;
    private String attachments;
}
