package com.research.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

/**
 * 年度检查通知DTO
 */
@Data
public class AnnualNoticeDTO {
    @NotNull(message = "检查年度不能为空")
    private Integer year;
    
    @NotNull(message = "项目列表不能为空")
    private List<Long> projectIds;
    
    private String deadline;
    private String requirements;
}
