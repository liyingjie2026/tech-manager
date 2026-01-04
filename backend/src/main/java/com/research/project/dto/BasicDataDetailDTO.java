package com.research.project.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * 基础数据资源详情DTO
 */
@Data
public class BasicDataDetailDTO {
    private Long id;
    private String dataName;
    private String dataCode;
    private String category;
    private String format;
    private String size;
    private String description;
    private String provider;
    private String providerContact;
    private LocalDate updateDate;
    private String dataStructure;
    private String sampleData;
    private String usageInstructions;
    private List<AttachmentDTO> attachments;
    private String status;
    private Boolean shareable;
    private String downloadStatus;
}
