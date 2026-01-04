package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 需求视图对象
 */
@Data
public class DemandVO {
    
    private Long id;
    
    private String demandNo;
    
    private String title;
    
    private String type;
    
    private String typeText;
    
    private String category;
    
    private String categoryText;
    
    private String field;
    
    private String fieldText;
    
    private String priority;
    
    private String priorityText;
    
    private String description;
    
    private String background;
    
    private String objectives;
    
    private String requirements;
    
    private String expectedResults;
    
    private BigDecimal budget;
    
    private LocalDate deadline;
    
    private String contactPerson;
    
    private String contactPhone;
    
    private String contactEmail;
    
    private Long createBy;
    
    private String creatorName;
    
    private String status;
    
    private String statusText;
    
    private Integer responseCount;
    
    private LocalDateTime createTime;
}
