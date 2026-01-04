package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.RolePermission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 角色权限关联Mapper接口
 */
@Mapper
public interface RolePermissionMapper extends BaseMapper<RolePermission> {
    
    /**
     * 根据角色ID删除权限关联
     */
    int deleteByRoleId(@Param("roleId") Long roleId);
    
    /**
     * 根据权限ID删除角色关联
     */
    int deleteByPermissionId(@Param("permissionId") Long permissionId);
}
