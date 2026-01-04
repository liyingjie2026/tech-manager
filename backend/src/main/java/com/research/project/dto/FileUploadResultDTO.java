package com.research.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文件上传结果DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "文件上传结果")
public class FileUploadResultDTO {
    
    @Schema(description = "文件ID")
    private Long fileId;
    
    @Schema(description = "文件名")
    private String fileName;
    
    @Schema(description = "文件大小（字节）")
    private Long fileSize;
    
    @Schema(description = "文件路径")
    private String filePath;
    
    @Schema(description = "文件URL")
    private String fileUrl;
    
    @Schema(description = "文件类型")
    private String fileType;
    
    @Schema(description = "上传时间")
    private String uploadTime;
}
