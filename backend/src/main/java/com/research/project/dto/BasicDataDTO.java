package com.research.project.dto;

import lombok.Data;

/**
 * 基础数据资源DTO
 */
@Data
public class BasicDataDTO {
    private Long id;
    private String dataName;
    private String dataCode;
    private String category;
    private String format;
    private String size;
    private String description;
    private String provider;
    private String status;
    private Boolean shareable;
}
