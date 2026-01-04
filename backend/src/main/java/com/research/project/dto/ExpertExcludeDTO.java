package com.research.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 专家回避DTO
 */
@Data
public class ExpertExcludeDTO {
    @NotNull(message = "专家ID不能为空")
    private Long expertId;
    
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    private String reason;
}
