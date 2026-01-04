package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 获奖实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_award")
public class Award extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 项目ID */
    private Long projectId;
    
    /** 项目名称 */
    private String projectName;
    
    /** 奖项名称 */
    private String name;
    
    /** 奖项类别：national-国家级 provincial-省部级 municipal-市厅级 other-其他 */
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
    
    public String getRemark() {
        return this.remark != null ? this.remark : this.description;
    }
    

}
