package com.research.project.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 附件DTO
 */
@Data
public class AttachmentDTO {
    private Long id;
    private Long projectId;
    private String entityType;
    private Long entityId;
    private String fileName;
    private String filePath;
    private Long fileSize;
    private String fileType;
    private String attachmentType;
    private LocalDateTime uploadTime;
    private Long uploadBy;
    private String fileUrl;
    private String name;
    private Long size;
    private String type;
}
