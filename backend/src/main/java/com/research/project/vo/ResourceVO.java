package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 资源视图对象
 */
@Data
public class ResourceVO {
    
    private Long id;
    
    private String resourceNo;
    
    private String name;
    
    private String type;
    
    private String typeText;
    
    private String category;
    
    private String categoryText;
    
    private String field;
    
    private String fieldText;
    
    private String specification;
    
    private String manufacturer;
    
    private String model;
    
    private BigDecimal price;
    
    private String location;
    
    private Long ownerUnitId;
    
    private String ownerUnitName;
    
    private String contactPerson;
    
    private String contactPhone;
    
    private String description;
    
    private String usageRequirements;
    
    private BigDecimal rentalFee;
    
    private String rentalUnit;
    
    private Boolean isShareable;
    
    private String imageUrl;
    
    private Integer usageCount;
    
    private Integer status;
    
    private String statusText;
    
    private LocalDateTime createTime;
}
