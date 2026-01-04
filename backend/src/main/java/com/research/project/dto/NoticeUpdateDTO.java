package com.research.project.dto;

import lombok.Data;

/**
 * 更新通知DTO
 */
@Data
public class NoticeUpdateDTO {
    private String title;
    private String noticeType;
    private String content;
    private String targetType;
    private String targetIds;
    private String attachments;
}
