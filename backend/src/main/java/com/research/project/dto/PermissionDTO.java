package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * 权限数据传输对象
 */
@Data
public class PermissionDTO {
    
    private Long id;
    
    @NotBlank(message = "权限编码不能为空")
    private String permissionCode;
    
    @NotBlank(message = "权限名称不能为空")
    private String permissionName;
    
    private String type;
    
    private Long parentId;
    
    private String path;
    
    private String component;
    
    private String icon;
    
    private Integer sort;
    
    private Integer status;
    
    private List<PermissionDTO> children;
    
    private String remark;
}
