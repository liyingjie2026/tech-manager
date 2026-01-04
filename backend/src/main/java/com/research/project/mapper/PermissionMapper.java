package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Permission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

/**
 * 权限Mapper接口
 */
@Mapper
public interface PermissionMapper extends BaseMapper<Permission> {
    
    /**
     * 根据角色ID查询权限列表
     */
    List<Permission> selectByRoleId(@Param("roleId") Long roleId);
    
    /**
     * 查询菜单权限
     */
    List<Permission> selectMenus();
    
    /**
     * 查询菜单树
     */
    List<Permission> selectMenuTree();
    
    /**
     * 删除角色权限关联
     */
    int deleteByRoleId(@Param("roleId") Long roleId);
    
    /**
     * 批量插入角色权限关联
     */
    int batchInsertRolePermissions(@Param("roleId") Long roleId, @Param("permissionIds") List<Long> permissionIds);
    
    // Database schema only has sys_role_permission table
    /**
     * 根据用户ID查询权限列表 - 需要通过user.role_id查询
     */
    @Select("SELECT p.* FROM sys_permission p " +
            "INNER JOIN sys_role_permission rp ON p.id = rp.permission_id " +
            "INNER JOIN sys_user u ON rp.role_id = u.role_id " +
            "WHERE u.id = #{userId} AND p.deleted = 0 AND p.status = 1")
    List<Permission> selectByUserId(@Param("userId") Long userId);
}
