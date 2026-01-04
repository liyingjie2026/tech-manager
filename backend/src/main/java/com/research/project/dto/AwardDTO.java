package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * 获奖数据传输对象
 */
@Data
public class AwardDTO {
    
    private Long id;
    
    /** 项目ID */
    private Long projectId;
    
    /** 项目名称 */
    private String projectName;
    
    /** 奖项名称 */
    @NotBlank(message = "奖项名称不能为空")
    private String name;
    
    /** 奖项类别：national-国家级 provincial-省部级 municipal-市厅级 other-其他 */
    @NotBlank(message = "奖项类别不能为空")
    private String category;
    
    /** 奖项等级：first-一等奖 second-二等奖 third-三等奖 other-其他 */
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
    
    /** 附件 */
    private String attachments;
    
    /** 状态：draft-草稿 pending-待审核 approved-已通过 rejected-已驳回 */
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
    
    /** 创建时间 */
    private LocalDateTime createTime;
    
    /** 更新时间 */
    private LocalDateTime updateTime;
    
    /** 创建人 */
    private Long createBy;
    
    /** 更新人 */
    private Long updateBy;
}
