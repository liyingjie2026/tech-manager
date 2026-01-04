package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 更新成果转化DTO
 */
@Data
public class TransformationUpdateDTO {
    private String transformationType;
    private String transformationUnit;
    private String transformationDate;
    private BigDecimal transformationValue;
    private String transformationDesc;
    private String attachments;
}
