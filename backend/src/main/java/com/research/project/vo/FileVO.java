package com.research.project.vo;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 文件视图对象
 */
@Data
public class FileVO {
    
    private Long id;
    
    private String fileName;
    
    private String originalName;
    
    private String fileType;
    
    private String filePath;
    
    private String fileUrl;
    
    private Long fileSize;
    
    private String fileSizeText;
    
    private String businessType;
    
    private Long businessId;
    
    private Long uploadBy;
    
    private String uploaderName;
    
    private LocalDateTime uploadTime;
}
