package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 成果实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_achievement")
public class Achievement extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
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
    
    /** 成果类型：paper-论文 patent-专利 software-软著 standard-标准 book-专著 other-其他 */
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
    
    /** 附件 */
    private String attachments;
    
    /** 是否公开：0-否 1-是 */
    private Integer isPublic;
    
    /** 是否推介：0-否 1-是 */
    private Integer isPromoted;
    
    /** 是否已发布 */
    private Boolean published;
    
    /** 浏览次数 */
    private Integer viewCount;
    
    /** 下载次数 */
    private Integer downloadCount;
    
    /** 状态：draft-草稿 pending-待审核 approved-已通过 rejected-已驳回 */
    private String status;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 审核时间 */
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private String auditBy;
    
    public Boolean isPublished() {
        return this.published;
    }
    
    public String getTitle() {
        return this.title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
}
