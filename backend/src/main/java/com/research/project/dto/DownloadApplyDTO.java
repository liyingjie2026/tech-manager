package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 下载申请DTO
 */
@Data
public class DownloadApplyDTO {
    @NotNull(message = "用户ID不能为空")
    private Long userId;
    
    @NotNull(message = "单位ID不能为空")
    private Long institutionId;
    
    @NotBlank(message = "申请原因不能为空")
    private String reason;
    
    public String getPurpose() {
        return reason;
    }
    
    public void setPurpose(String purpose) {
        this.reason = purpose;
    }
}
