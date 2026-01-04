package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

/**
 * 创建评审DTO
 */
@Data
public class ReviewCreateDTO {
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    @NotBlank(message = "评审类型不能为空")
    private String reviewType;
    
    @NotNull(message = "专家列表不能为空")
    private List<Long> expertIds;
    
    private String reviewDate;
    private String reviewRequirement;
}
