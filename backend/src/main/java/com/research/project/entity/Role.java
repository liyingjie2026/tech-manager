package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 角色实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_role")
public class Role extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 角色编码 */
    private String roleCode;
    
    /** 角色名称 */
    private String roleName;
    
    /** 角色描述 */
    private String description;
    
    /** 排序 */
    private Integer sort;
    
    /** 状态：0-禁用 1-启用 */
    private Integer status;
}
