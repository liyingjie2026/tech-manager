package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 创建设备DTO
 */
@Data
public class EquipmentCreateDTO {
    @NotBlank(message = "设备名称不能为空")
    private String equipmentName;
    
    private String equipmentNo;
    private String equipmentType;
    private String model;
    private String manufacturer;
    private BigDecimal price;
    private String purchaseDate;
    private String location;
    private String manager;
    private String description;
}
