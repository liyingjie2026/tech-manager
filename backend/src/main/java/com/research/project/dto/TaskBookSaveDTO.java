package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 任务书保存DTO
 */
@Data
public class TaskBookSaveDTO {
    private Long projectId;
    
    private String objective;
    
    private String content;
    
    private String expectedResult;
    
    private String indicators;
    private String taskBookFile;
    private String sealedFile;
    private Integer needMidterm;
    private String midtermDate;
    private Integer needAnnual;
    private String annualDate;
}
