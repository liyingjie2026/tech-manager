package com.research.project.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 角色视图对象
 */
@Data
public class RoleVO {
    
    private Long id;
    
    private String roleCode;
    
    private String roleName;
    
    private String description;
    
    private List<Long> permissionIds;
    
    private List<PermissionVO> permissions;
    
    private Integer userCount;
    
    private Integer sort;
    
    private Integer status;
    
    private String statusText;
    
    private LocalDateTime createTime;
}
