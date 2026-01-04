package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建软件DTO
 */
@Data
public class SoftwareCreateDTO {
    @NotBlank(message = "软件名称不能为空")
    private String softwareName;
    
    private String softwareType;
    private String version;
    private String vendor;
    private String license;
    private String description;
}
