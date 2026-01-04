package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 角色权限关联实体类
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName("sys_role_permission")
public class RolePermission extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long roleId;        // 角色ID
    private Long permissionId;  // 权限ID
    
}
