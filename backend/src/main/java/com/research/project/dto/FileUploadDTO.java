package com.research.project.dto;

import lombok.Data;

/**
 * 文件上传DTO
 */
@Data
public class FileUploadDTO {
    
    private String fileName;
    
    private String fileType;
    
    private Long fileSize;
    
    private String businessType;
    
    private Long businessId;
    
    private String remark;
}
