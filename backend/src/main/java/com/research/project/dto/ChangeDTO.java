package com.research.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 变更申请数据传输对象 - 完全匹配Change实体
 */
@Data
public class ChangeDTO {
    
    private Long id;
    
    private String changeNo;
    
    private String projectNo;
    
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    private String projectName;
    
    @NotBlank(message = "变更类型不能为空")
    private String changeType;
    
    @NotBlank(message = "变更原因不能为空")
    private String changeReason;
    
    private String originalContent;
    
    @NotBlank(message = "变更内容不能为空")
    private String changedContent;
    
    private String impact;
    
    private String attachments;
    
    private String status;
    
    private String auditStatus;
    
    private String auditComment;
    
    private LocalDateTime auditTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime submitTime;
    
    private String remark;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
    
    private Long createBy;
    
    private Long updateBy;
    
    private Integer deleted;

    private String institutionName;
}
