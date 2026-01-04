package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

/**
 * 驳回DTO
 */
@Data
public class RejectDTO {
    @NotBlank(message = "驳回原因不能为空")
    private String reason;
}
