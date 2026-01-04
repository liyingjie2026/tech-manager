package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 资质变更DTO
 */
@Data
public class QualificationChangeDTO {
    @NotBlank(message = "变更类型不能为空")
    private String changeType;
    
    private String newQualification;
    private String reason;
    private String attachments;
}
