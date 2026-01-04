package com.research.project.dto;

import lombok.Data;

/**
 * 任务书审批DTO
 */
@Data
public class TaskBookApproveDTO {
    private String comment;
    
    /** 是否需要中期检查：0-否 1-是 */
    private Integer needMidterm;
    
    /** 中期检查时间 */
    private String midtermDate;
    
    /** 是否需要年度检查：0-否 1-是 */
    private Integer needAnnual;
    
    /** 年度检查时间 */
    private String annualDate;
}
