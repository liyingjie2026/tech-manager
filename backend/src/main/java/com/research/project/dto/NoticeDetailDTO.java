package com.research.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 通知详情DTO
 */
@Data
@Schema(description = "通知详情")
public class NoticeDetailDTO {
    
    @Schema(description = "通知ID")
    private Long id;
    
    @Schema(description = "通知标题")
    private String title;
    
    @Schema(description = "通知类型")
    private String type;
    
    @Schema(description = "通知类型名称")
    private String typeName;
    
    @Schema(description = "通知内容")
    private String content;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "状态名称")
    private String statusName;
    
    @Schema(description = "发布时间")
    private LocalDateTime publishTime;
    
    @Schema(description = "发布人")
    private String publisher;
    
    @Schema(description = "附件列表")
    private List<String> attachments;
    
    @Schema(description = "是否已读")
    private Boolean isRead;
    
    @Schema(description = "阅读时间")
    private LocalDateTime readTime;
    
    @Schema(description = "是否置顶")
    private Boolean isTop;
    
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
    
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
