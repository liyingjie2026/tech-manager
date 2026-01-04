package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 流程定义实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("wf_workflow")
public class Workflow extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 流程编码 */
    private String workflowCode;
    
    /** 流程名称 */
    private String workflowName;
    
    /** 流程类型 */
    private String workflowType;
    
    /** 流程描述 */
    private String description;
    
    /** 流程定义JSON */
    private String definition;
    
    /** 版本号 */
    private Integer version;
    
    /** 是否当前版本：0-否 1-是 */
    private Integer isCurrent;
    
    /** 状态：0-禁用 1-启用 */
    private Integer status;
    
}
