package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建通知DTO
 */
@Data
public class NoticeCreateDTO {
    @NotBlank(message = "通知标题不能为空")
    private String title;
    
    @NotBlank(message = "通知类型不能为空")
    private String noticeType;
    
    @NotBlank(message = "通知内容不能为空")
    private String content;
    
    private String targetType;
    private String targetIds;
    private String attachments;
}
