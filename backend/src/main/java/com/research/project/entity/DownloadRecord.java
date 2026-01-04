package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 数据下载记录实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("prj_download_record")
public class DownloadRecord extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 数据ID */
    private Long dataId;
    
    /** 下载人 */
    private Long downloaderId;
    
    /** 下载单位 */
    private Long institutionId;
    
    /** 下载原因 */
    private String reason;
    
    /** 下载时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime downloadTime;
    
    /** 状态：pending-待审核 approved-已批准 downloaded-已下载 rejected-已拒绝 */
    private String status;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 审核时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private Long auditorId;
    
}
