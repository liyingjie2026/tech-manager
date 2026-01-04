package com.research.project.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

/**
 * 通用查询DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class QueryDTO extends PageDTO {
    
    private String keyword;
    
    private String status;
    
    private String type;
    
    private Long institutionId;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private Long createBy;
}
