package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 设备资源DTO
 */
@Data
public class EquipmentDTO {
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
    private String status;
    private Boolean shareable;
}
