package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.io.Serializable;

/**
 * 工作流历史记录实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("prj_workflow_history")
public class WorkflowHistory extends BaseEntity implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long projectId;
    private String fromStage;
    private String toStage;
    private String action;
    private Long operatorId;
    private String operatorName;
    private String operatorRole;
    
    /** 操作意见 */
    private String comment;
    
    // Inherits createTime, updateTime, createBy, updateBy, deleted from BaseEntity
}
