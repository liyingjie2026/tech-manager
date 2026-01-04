package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 角色权限DTO
 */
@Data
public class RolePermissionDTO {
    private Long roleId;
    private List<Long> pagePermissions;
    private List<Long> buttonPermissions;
    
    public void setPermissionIds(List<Long> permissionIds) {
        this.pagePermissions = permissionIds;
    }
    
    public List<Long> getPermissionIds() {
        return this.pagePermissions;
    }
}
