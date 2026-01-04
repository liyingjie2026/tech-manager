package com.research.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

/**
 * 中期检查通知DTO
 */
@Data
public class MidtermNoticeDTO {
    @NotNull(message = "项目列表不能为空")
    private List<Long> projectIds;
    
    @NotNull(message = "检查年度不能为空")
    private Integer checkYear;
    
    private String deadline;
    private String requirements;
}
