package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * 批量驳回DTO
 */
@Data
public class BatchRejectDTO {
    @NotEmpty(message = "项目ID列表不能为空")
    private List<Long> ids;
    
    @NotBlank(message = "驳回原因不能为空")
    private String reason;
}
