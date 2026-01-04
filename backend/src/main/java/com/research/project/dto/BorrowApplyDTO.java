package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

/**
 * 借用申请DTO
 */
@Data
public class BorrowApplyDTO {
    @NotNull(message = "用户ID不能为空")
    private Long userId;
    
    @NotNull(message = "单位ID不能为空")
    private Long institutionId;
    
    @NotBlank(message = "借用开始时间不能为空")
    private String startDate;
    
    @NotBlank(message = "借用结束时间不能为空")
    private String endDate;
    
    @NotBlank(message = "借用用途不能为空")
    private String purpose;
    
    public LocalDate getStartDateAsLocalDate() {
        return LocalDate.parse(startDate);
    }
    
    public LocalDate getEndDateAsLocalDate() {
        return LocalDate.parse(endDate);
    }
}
