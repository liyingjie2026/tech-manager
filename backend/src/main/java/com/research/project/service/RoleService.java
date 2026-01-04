package com.research.project.service;

import com.research.project.common.PageResult;
import com.research.project.dto.RoleCreateDTO;
import com.research.project.dto.RoleDTO;
import com.research.project.dto.RoleUpdateDTO;

import java.util.List;

/**
 * 角色服务接口
 */
public interface RoleService {
    
    /**
     * 分页查询角色列表
     */
    PageResult<RoleDTO> list(Integer page, Integer size, String keyword);
    
    /**
     * 获取所有角色
     */
    List<RoleDTO> listAll();
    
    /**
     * 根据ID获取角色详情
     */
    RoleDTO getById(Long id);
    
    /**
     * 创建角色
     */
    Long create(RoleCreateDTO dto);
    
    /**
     * 更新角色
     */
    void update(Long id, RoleUpdateDTO dto);
    
    /**
     * 删除角色
     */
    void delete(Long id);
    
    /**
     * 分配角色权限
     */
    void assignPermissions(Long roleId, List<Long> permissionIds);
    
    /**
     * 获取角色权限
     */
    List<Long> getPermissions(Long roleId);
}
