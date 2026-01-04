package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 成果转化视图对象
 */
@Data
public class TransformationVO {
    
    private Long id;
    
    private String transformationNo;
    
    private Long achievementId;
    
    private String achievementName;
    
    private String content;
    
    private String type;
    
    private String typeText;
    
    private String unit;
    
    private String principal;
    
    private String contact;
    
    private String value;
    
    private String status;
    
    private String statusText;
    
    private String comment;
    
    private String attachments;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
    
    private String createBy;
    
    private String updateBy;
}
