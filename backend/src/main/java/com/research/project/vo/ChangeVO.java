package com.research.project.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 变更视图对象
 */
@Data
public class ChangeVO {
    
    private Long id;
    
    private String changeNo;
    
    private Long projectId;
    
    private String projectNo;
    
    private String projectName;
    
    private String institutionName;
    
    private String changeType;
    
    private String changeTypeText;
    
    private String changeReason;
    
    private String originalContent;
    
    private String changedContent;
    
    private String impact;
    
    private List<FileVO> attachments;
    
    private Long applyBy;
    
    private String applyByName;
    
    private String status;
    
    private String statusText;
    
    private String approvalOpinion;
    
    private Long approvalBy;
    
    private String approvalByName;
    
    private LocalDateTime applyTime;
    
    private LocalDateTime approvalTime;
    
    private LocalDateTime createTime;
}
