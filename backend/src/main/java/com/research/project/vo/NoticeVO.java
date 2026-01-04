package com.research.project.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 通知公告视图对象
 */
@Data
public class NoticeVO {
    
    private Long id;
    
    private String title;
    
    private String type;
    
    private String typeText;
    
    private String content;
    
    private List<FileVO> attachments;
    
    private LocalDateTime publishTime;
    
    private LocalDateTime expireTime;
    
    private Boolean isTop;
    
    private Long createBy;
    
    private String creatorName;
    
    private Integer viewCount;
    
    private Integer status;
    
    private String statusText;
    
    private LocalDateTime createTime;
}
