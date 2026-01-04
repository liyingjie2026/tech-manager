package com.research.project.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 权限视图对象
 */
@Data
public class PermissionVO {
    
    private Long id;
    
    private String permissionCode;
    
    private String permissionName;
    
    private String type;
    
    private String typeText;
    
    private Long parentId;
    
    private String parentName;
    
    private String path;
    
    private String component;
    
    private String icon;
    
    private Integer sort;
    
    private Integer status;
    
    private String statusText;
    
    private List<PermissionVO> children;
    
    private LocalDateTime createTime;
}
