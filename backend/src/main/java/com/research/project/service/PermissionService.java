package com.research.project.service;

import com.research.project.dto.*;

import java.util.List;

/**
 * 权限服务接口
 */
public interface PermissionService {
    
    /**
     * 获取权限树
     */
    List<PermissionTreeDTO> getTree();
    
    /**
     * 获取页面列表
     */
    List<PagePermissionDTO> getPages();
    
    /**
     * 获取页面按钮权限
     */
    List<ButtonPermissionDTO> getPageButtons(Long pageId);
    
    /**
     * 获取角色权限配置
     */
    RolePermissionDTO getRolePermissions(Long roleId);
    
    /**
     * 保存角色权限配置
     */
    void saveRolePermissions(Long roleId, RolePermissionSaveDTO dto);
    
    /**
     * 新增页面权限
     */
    Long createPage(PagePermissionCreateDTO dto);
    
    /**
     * 新增按钮权限
     */
    Long createButton(Long pageId, ButtonPermissionCreateDTO dto);
    
    /**
     * 更新按钮权限
     */
    void updateButton(Long buttonId, ButtonPermissionUpdateDTO dto);
    
    /**
     * 删除按钮权限
     */
    void deleteButton(Long buttonId);
    
    /**
     * 检查当前用户权限
     */
    Boolean checkPermission(String pageCode, String buttonCode);
    
    /**
     * 获取当前用户所有权限
     */
    UserPermissionsDTO getMyPermissions();
}
