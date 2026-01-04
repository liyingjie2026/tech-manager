package com.research.project.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 获奖详情DTO
 */
@Data
public class AwardDetailDTO {
    private Long id;
    
    /** 项目ID */
    private Long projectId;
    
    /** 项目名称 */
    private String projectName;
    
    /** 奖项名称 */
    private String name;
    
    /** 奖项类别 */
    private String category;
    
    /** 奖项等级 */
    private String level;
    
    /** 获奖时间 */
    private String awardDate;
    
    /** 颁奖单位 */
    private String awardUnit;
    
    /** 获奖单位 */
    private String winningUnit;
    
    /** 获奖人员 */
    private String winningPerson;
    
    /** 奖项描述 */
    private String description;
    
    /** 证书编号 */
    private String certificateNo;
    
    /** 状态 */
    private String status;
    
    /** 审核意见 */
    private String auditComment;
    
    /** 审核时间 */
    private LocalDateTime auditTime;
    
    /** 审核人 */
    private String auditBy;
    
    /** 获奖时间（LocalDateTime格式） */
    private LocalDateTime awardTime;
    
    /** 证书URL */
    private String certificateUrl;
    
    /** 备注 */
    private String remark;
    
    /** 附件列表 */
    private List<AttachmentDTO> attachments;
    
    /** 创建时间 */
    private LocalDateTime createTime;
    
    /** 更新时间 */
    private LocalDateTime updateTime;
    
    /** 创建人 */
    private Long createBy;
}
