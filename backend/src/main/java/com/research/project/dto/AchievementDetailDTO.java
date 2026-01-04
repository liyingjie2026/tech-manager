package com.research.project.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 成果详情DTO
 */
@Data
public class AchievementDetailDTO {
    private Long id;
    
    /** 成果编号 */
    private String achievementNo;
    
    /** 项目ID */
    private Long projectId;
    
    /** 项目名称 */
    private String projectName;
    
    /** 成果标题 */
    private String title;
    
    /** 成果名称 */
    private String name;
    
    /** 成果类型 */
    private String type;
    
    /** 成果领域 */
    private String field;
    
    /** 完成单位 */
    private String completionUnit;
    
    /** 完成人 */
    private String completionPerson;
    
    /** 完成时间 */
    private String completionDate;
    
    /** 成果简介 */
    private String description;
    
    /** 成果详情 */
    private String detail;
    
    /** 关键词 */
    private String keywords;
    
    /** 是否公开 */
    private Integer isPublic;
    
    /** 是否推介 */
    private Integer isPromoted;
    
    /** 是否已发布 */
    private Boolean published;
    
    /** 浏览次数 */
    private Integer viewCount;
    
    /** 下载次数 */
    private Integer downloadCount;
    
    /** 状态 */
    private String status;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 审核时间 */
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private String auditBy;
    
    /** 附件列表 */
    private List<AttachmentDTO> attachments;
    
    /** 创建时间 */
    private LocalDateTime createTime;
    
    /** 更新时间 */
    private LocalDateTime updateTime;
    
    /** 创建人 */
    private Long createBy;
}
