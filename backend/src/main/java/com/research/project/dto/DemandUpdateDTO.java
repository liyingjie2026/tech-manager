package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 更新需求DTO
 */
@Data
public class DemandUpdateDTO {
    private String demandName;
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
