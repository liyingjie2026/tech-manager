package com.research.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * 资源申请DTO
 */
@Data
public class ResourceApplyDTO {
    
    private Long id;
    
    @NotNull(message = "资源ID不能为空")
    private Long resourceId;
    
    private Long projectId;
    
    @NotNull(message = "开始日期不能为空")
    private LocalDate startDate;
    
    @NotNull(message = "结束日期不能为空")
    private LocalDate endDate;
    
    private String purpose;
    
    private String remark;
}
