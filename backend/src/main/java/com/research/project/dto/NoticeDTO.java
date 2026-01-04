package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 通知公告数据传输对象
 */
@Data
public class NoticeDTO {
    
    private Long id;
    
    @NotBlank(message = "标题不能为空")
    private String title;
    
    private String type;
    
    private String content;
    
    private List<Long> attachmentIds;
    
    private LocalDateTime publishTime;
    
    private LocalDateTime expireTime;
    
    private Boolean isTop;
    
    private Integer status;
    
    private String targetType;
    
    private List<Long> targetIds;
    
    private String remark;
}
