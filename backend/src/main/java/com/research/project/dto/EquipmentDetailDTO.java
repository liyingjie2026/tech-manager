package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 设备资源详情DTO
 */
@Data
public class EquipmentDetailDTO {
    private Long id;
    private String equipmentName;
    private String equipmentCode;
    private String category;
    private String model;
    private String manufacturer;
    private LocalDate purchaseDate;
    private BigDecimal price;
    private String location;
    private String manager;
    private String managerPhone;
    private String specifications;
    private String functions;
    private String usageGuide;
    private List<String> images;
    private String status;
    private Boolean shareable;
    private String borrowStatus;
}
