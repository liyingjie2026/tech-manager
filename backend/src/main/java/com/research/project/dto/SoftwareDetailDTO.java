package com.research.project.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * 软件资源详情DTO
 */
@Data
public class SoftwareDetailDTO {
    private Long id;
    private String softwareName;
    private String softwareCode;
    private String category;
    private String version;
    private String developer;
    private String developerContact;
    private String license;
    private String licenseExpiry;
    private String description;
    private String features;
    private String systemRequirements;
    private String installGuide;
    private String usageManual;
    private List<AttachmentDTO> attachments;
    private String status;
    private Boolean shareable;
    private String applyStatus;
}
