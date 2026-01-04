package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 更新设备DTO
 */
@Data
public class EquipmentUpdateDTO {
    private String equipmentName;
    private String equipmentType;
    private String model;
    private String location;
    private String manager;
    private String description;
}
