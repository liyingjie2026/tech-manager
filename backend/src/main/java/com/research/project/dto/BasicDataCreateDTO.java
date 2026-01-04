package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建基础数据DTO
 */
@Data
public class BasicDataCreateDTO {
    @NotBlank(message = "数据名称不能为空")
    private String dataName;
    
    @NotBlank(message = "数据类型不能为空")
    private String dataType;
    
    private String dataSource;
    private String dataDesc;
    private String dataSize;
    private String dataFormat;
    private String filePath;
}
