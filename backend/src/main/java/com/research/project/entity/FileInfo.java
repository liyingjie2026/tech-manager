package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 文件信息实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("sys_file")
public class FileInfo extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 文件名 */
    private String fileName;
    
    /** 原始文件名 */
    private String originalName;
    
    /** 文件路径 */
    private String filePath;
    
    /** 文件URL */
    private String fileUrl;
    
    /** 文件大小（字节） */
    private Long fileSize;
    
    /** 文件类型 */
    private String fileType;
    
    /** MIME类型 */
    private String mimeType;
    
    /** 文件MD5 */
    private String md5;
    
    /** 业务类型 */
    private String businessType;
    
    /** 业务ID */
    private Long businessId;
    
    /** 上传人ID */
    private Long uploadBy;
    
    /** 上传人名称 */
    private String uploadByName;
    
    /** 下载次数 */
    private Integer downloadCount;
    
    /** 状态：0-禁用 1-启用 */
    private Integer status;
    
}
