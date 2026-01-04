package com.research.project.dto;

import lombok.Data;

/**
 * 页面权限DTO
 */
@Data
public class PagePermissionDTO {
    private Long id;
    private String name;
    private String code;
    private String path;
    private String icon;
    private Integer sort;
    private Long parentId;
    private Boolean enabled;
    
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
    
    public Long getParentId() {
        return this.parentId;
    }
}
