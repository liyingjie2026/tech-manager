package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 统一字典实体类（支持层级结构）
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_dictionary")
public class Dictionary extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 父级ID，0表示根节点 */
    private Long parentId;
    
    /** 字典类型编码（用于分组） */
    private String dictType;
    
    /** 字典类型名称 */
    private String dictName;
    
    /** 字典项编码 */
    private String itemCode;
    
    /** 字典项标签（显示名称） */
    private String itemLabel;
    
    /** 字典项值 */
    private String itemValue;
    
    /** 层级：1-字典类型 2-一级项 3-二级项... */
    private Integer level;
    
    /** 描述 */
    private String description;
    
    /** 排序 */
    private Integer sort;
    
    /** 是否启用：0-禁用 1-启用 */
    private Boolean enabled;
    
    /** 子节点列表（非数据库字段，用于树形结构） */
    @TableField(exist = false)
    private List<Dictionary> children;
}
