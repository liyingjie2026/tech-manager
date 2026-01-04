package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeCreateDTO {
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    @NotBlank(message = "变更类型不能为空")
    private String changeType;
    
    @NotBlank(message = "变更原因不能为空")
    private String changeReason;
    
    private String beforeContent;
    private String afterContent;
    private String attachments;
    private String changeItem;
    private String applyUnit;
    private String applicant;
    
    private String newContent;
}
