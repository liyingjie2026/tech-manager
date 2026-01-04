package com.research.project.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TodoItemDTO {
    private Long id;
    
    private Long userId;
    private String userName;
    private String role;
    
    private String title;
    private String description;
    private String type;
    private String typeName;
    
    private Long businessId;
    private String businessNo;
    private String businessType;
    
    private String priority;
    private String priorityName;
    private String status;
    private String statusName;
    
    private LocalDateTime deadline;
    private String linkUrl;
    
    private String completedBy;
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Long createBy;
    private Long updateBy;
    
    private Boolean isOverdue;
    private Integer daysRemaining;
}
