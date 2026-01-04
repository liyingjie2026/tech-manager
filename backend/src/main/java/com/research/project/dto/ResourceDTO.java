package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

/**
 * 资源数据传输对象
 */
@Data
public class ResourceDTO {
    
    private Long id;
    
    @NotBlank(message = "资源名称不能为空")
    private String name;
    
    @NotBlank(message = "资源类型不能为空")
    private String type;
    
    private String category;
    
    private String field;
    
    private String specification;
    
    private String manufacturer;
    
    private String model;
    
    private BigDecimal price;
    
    private String location;
    
    private Long ownerUnitId;
    
    private String contactPerson;
    
    private String contactPhone;
    
    private String description;
    
    private String usageRequirements;
    
    private BigDecimal rentalFee;
    
    private String rentalUnit;
    
    private Boolean isShareable;
    
    private String imageUrl;
    
    private Integer status;
    
    private String remark;
}
