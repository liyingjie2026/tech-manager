package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 成果转化实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_transformation")
public class Transformation extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 成果ID */
    private Long achievementId;
    
    /** 转化编号 */
    private String transformationNo;
    
    /** 转化内容 */
    private String content;
    
    /** 转化类型 */
    private String type;
    
    /** 转化单位 */
    private String unit;
    
    /** 转化负责人 */
    private String principal;
    
    /** 联系方式 */
    private String contact;
    
    /** 转化状态：draft-草稿 pending-待审核 approved-已通过 rejected-已驳回 */
    private String status;
    
    /** 审核意见 */
    private String comment;
    
    /** 转化价值 */
    private String value;
    
    /** 附件 */
    private String attachments;
}
