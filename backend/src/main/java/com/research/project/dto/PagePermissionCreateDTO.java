package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建页面权限DTO
 */
@Data
public class PagePermissionCreateDTO {
    @NotBlank(message = "权限名称不能为空")
    private String permissionName;
    
    @NotBlank(message = "权限编码不能为空")
    private String permissionCode;
    
    private String path;
    private String component;
    private String icon;
    private Integer sortOrder;
    private Long parentId;
    
    public String getName() {
        return this.permissionName;
    }
    
    public void setName(String name) {
        this.permissionName = name;
    }
    
    public String getCode() {
        return this.permissionCode;
    }
    
    public void setCode(String code) {
        this.permissionCode = code;
    }
    
    public Integer getSort() {
        return this.sortOrder;
    }
    
    public void setSort(Integer sort) {
        this.sortOrder = sort;
    }
}
