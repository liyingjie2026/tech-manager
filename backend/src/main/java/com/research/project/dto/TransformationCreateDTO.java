package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 创建成果转化DTO
 */
@Data
public class TransformationCreateDTO {
    @NotBlank(message = "转化方式不能为空")
    private String transformationType;
    
    private String transformationUnit;
    private String transformationDate;
    private BigDecimal transformationValue;
    private String transformationDesc;
    private String attachments;
}
