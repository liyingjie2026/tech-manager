package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 查重结果DTO
 */
@Data
public class DuplicateCheckResultDTO {
    private Long id;
    
    private Long projectId;
    
    private String projectName;
    
    private String projectNo;
    
    private BigDecimal duplicateRate;
    
    private String similarProjects;
    private LocalDateTime checkTime;
    private Long checkBy;
}
