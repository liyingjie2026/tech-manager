package com.research.project.dto;

import lombok.Data;

/**
 * 更新按钮权限DTO
 */
@Data
public class ButtonPermissionUpdateDTO {
    private String buttonName;
    private String buttonCode;
    private Integer sortOrder;
    
    public String getName() {
        return this.buttonName;
    }
    
    public void setName(String name) {
        this.buttonName = name;
    }
    
    public String getCode() {
        return this.buttonCode;
    }
    
    public void setCode(String code) {
        this.buttonCode = code;
    }
    
    public Integer getSort() {
        return this.sortOrder;
    }
    
    public void setSort(Integer sort) {
        this.sortOrder = sort;
    }
}
