package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 通知公告实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_notice")
public class Notice extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 标题 */
    private String title;
    
    /** 类型：notice-通知 announcement-公告 policy-政策法规 news-新闻动态 */
    private String type;
    
    /** 内容 */
    private String content;
    
    /** 摘要 */
    private String summary;
    
    /** 附件 */
    private String attachments;
    
    /** 发布单位 */
    private String publishUnit;
    
    /** 发布人 */
    private String publishBy;
    
    /** 发布时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime publishTime;
    
    /** 是否置顶：0-否 1-是 */
    private Integer isTop;
    
    /** 浏览次数 */
    private Integer viewCount;
    
    /** 状态：draft-草稿 published-已发布 offline-已下线 */
    private String status;
    
}
