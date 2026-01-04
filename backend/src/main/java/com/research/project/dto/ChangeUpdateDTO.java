package com.research.project.dto;

import lombok.Data;

/**
 * 更新变更申请DTO
 */
@Data
public class ChangeUpdateDTO {
    private String changeType;
    private String changeReason;
    
    private String beforeContent;
    
    private String afterContent;
    
    private String attachments;
    private String changeItem;
    
    private String newContent;
}
