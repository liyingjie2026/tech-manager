package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 系统状态标签实体
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("sys_status_label")
public class StatusLabel extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 状态分类
     */
    private String category;
    
    /**
     * 状态英文值
     */
    private String value;
    
    /**
     * 状态中文显示
     */
    private String label;
    
    /**
     * 显示颜色
     */
    private String color;
    
    /**
     * 排序
     */
    private Integer sortOrder;
    
    /**
     * 是否启用
     */
    private Boolean isActive;
    
    /** 备注说明 */
    private String remark;
    
}
