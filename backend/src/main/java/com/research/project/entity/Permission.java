package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 权限实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("sys_permission")
public class Permission extends BaseEntity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 父级ID */
    private Long parentId;
    
    /** 权限编码 */
    private String permissionCode;
    
    /** 权限名称 */
    private String permissionName;
    
    /** 权限类型：menu-菜单 button-按钮 */
    private String type;
    
    /** 路由地址 */
    private String path;
    
    /** 组件路径 */
    private String component;
    
    /** 图标 */
    private String icon;
    
    /** 排序 */
    private Integer sort;
    
    /** 状态：0-禁用 1-启用 */
    private Integer status;
    
}
