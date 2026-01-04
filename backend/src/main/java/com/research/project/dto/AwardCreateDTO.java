package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 创建奖励DTO
 */
@Data
public class AwardCreateDTO {
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    @NotBlank(message = "奖励名称不能为空")
    private String awardName;
    
    @NotBlank(message = "奖励类型不能为空")
    private String awardType;
    
    private String awardLevel;
    private String awardDate;
    private String awardUnit;
    private String awardees;
    private String description;
    private String attachments;
}
