package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建按钮权限DTO
 */
@Data
public class ButtonPermissionCreateDTO {
    @NotBlank(message = "按钮名称不能为空")
    private String buttonName;
    
    @NotBlank(message = "按钮编码不能为空")
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
