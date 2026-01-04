package com.research.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.research.project.entity.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 角色Mapper接口
 */
@Mapper
public interface RoleMapper extends BaseMapper<Role> {
    
    /**
     * 根据角色编码查询角色
     */
    Role selectByRoleCode(@Param("roleCode") String roleCode);
    
    /**
     * 查询用户的角色列表
     */
    List<Role> selectRolesByUserId(@Param("userId") Long userId);
}
