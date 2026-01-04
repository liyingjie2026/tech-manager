package com.research.project.dto;

import lombok.Data;

/**
 * 软件资源DTO
 */
@Data
public class SoftwareDTO {
    private Long id;
    private String softwareName;
    private String softwareCode;
    private String category;
    private String version;
    private String developer;
    private String license;
    private String description;
    private String status;
    private Boolean shareable;
}
